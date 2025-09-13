import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const AppNavbar = () => {
  const { user, isAuth } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            <i className="bi bi-hammer me-2"></i>
            ServiceMarket
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            
            {isAuth && user?.role === 'customer' && (
              <>
                <LinkContainer to="/customer/requests">
                  <Nav.Link>My Requests</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/customer/bookings">
                  <Nav.Link>My Bookings</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/customer/requests/new">
                  <Nav.Link>
                    <i className="bi bi-plus-circle me-1"></i>
                    New Request
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
            
            {isAuth && user?.role === 'worker' && (
              <>
                <LinkContainer to="/worker/requests">
                  <Nav.Link>Available Jobs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/worker/bookings">
                  <Nav.Link>My Bookings</Nav.Link>
                </LinkContainer>
              </>
            )}
            
            {isAuth && user?.role === 'admin' && (
              <LinkContainer to="/admin/dashboard">
                <Nav.Link>Admin Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {isAuth ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-light" 
                  id="dropdown-user"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user?.name}
                  <span className="badge bg-secondary ms-2 text-capitalize">
                    {user?.role}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-bold">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </Dropdown.Header>
                  
                  <Dropdown.Divider />
                  
                  <LinkContainer to="/profile">
                    <Dropdown.Item>
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Dropdown.Item>
                  </LinkContainer>
                  
                  {user?.role === 'customer' && (
                    <>
                      <LinkContainer to="/customer/requests">
                        <Dropdown.Item>
                          <i className="bi bi-list-ul me-2"></i>
                          My Requests
                        </Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/customer/bookings">
                        <Dropdown.Item>
                          <i className="bi bi-calendar-check me-2"></i>
                          My Bookings
                        </Dropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  
                  {user?.role === 'worker' && (
                    <>
                      <LinkContainer to="/worker/requests">
                        <Dropdown.Item>
                          <i className="bi bi-briefcase me-2"></i>
                          Available Jobs
                        </Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/worker/bookings">
                        <Dropdown.Item>
                          <i className="bi bi-calendar-check me-2"></i>
                          My Bookings
                        </Dropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <LinkContainer to="/admin/dashboard">
                      <Dropdown.Item>
                        <i className="bi bi-speedometer2 me-2"></i>
                        Admin Dashboard
                      </Dropdown.Item>
                    </LinkContainer>
                  )}
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;