import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Tabs, Tab, Table, Button, Badge, Form } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import RevenueChart from './RevenueChart';
import UserGrowthChart from './UserGrowthChart';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, requestsResponse, bookingsResponse, revenueResponse, growthResponse] = 
        await Promise.all([
          adminService.getPlatformStats(),
          adminService.getAllUsers(0, 5),
          adminService.getAllServiceRequests(0, 5),
          adminService.getAllBookings(0, 5),
          adminService.getRevenueAnalytics(),
          adminService.getUserGrowth()
        ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data.content || usersResponse.data);
      setRequests(requestsResponse.data.content || requestsResponse.data);
      setBookings(bookingsResponse.data.content || bookingsResponse.data);
      setRevenueData(revenueResponse.data);
      setUserGrowthData(growthResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, active) => {
    try {
      await adminService.updateUserStatus(userId, active);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleRequestStatusChange = async (requestId, status) => {
    try {
      await adminService.updateRequestStatus(requestId, status);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError('Failed to update request status');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, color: 'primary', icon: '👥', trend: '+12%' },
    { title: 'Total Requests', value: stats.totalRequests, color: 'info', icon: '📋', trend: '+8%' },
    { title: 'Total Bookings', value: stats.totalBookings, color: 'warning', icon: '💰', trend: '+15%' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`, color: 'success', icon: '💵', trend: '+20%' },
    { title: 'Active Workers', value: stats.workers, color: 'secondary', icon: '🔧', trend: '+5%' },
    { title: 'Completed Jobs', value: stats.completedBookings, color: 'success', icon: '✅', trend: '+18%' }
  ];

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button variant="outline-primary" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Data
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="overview" title="Overview">
          {/* Statistics Cards */}
          <Row className="mb-4">
            {statCards.map((stat, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className={`border-${stat.color} h-100`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">{stat.title}</div>
                        <h3 className={`text-${stat.color}`}>{stat.value}</h3>
                        <Badge bg="success" className="fs-3">{stat.trend}</Badge>
                      </div>
                      <div className="display-4">{stat.icon}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Charts Row */}
          <Row className="mb-4">
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Revenue Analytics</h5>
                </Card.Header>
                <Card.Body>
                  <RevenueChart data={revenueData} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">User Growth</h5>
                </Card.Header>
                <Card.Body>
                  <UserGrowthChart data={userGrowthData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="users" title="Users Management">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Users</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={
                          user.role === 'admin' ? 'danger' :
                          user.role === 'worker' ? 'warning' : 'primary'
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Form.Check
                          type="switch"
                          checked={user.active !== false}
                          onChange={(e) => handleUserStatusChange(user.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <Button variant="outline-danger" size="sm">
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="requests" title="Service Requests">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Service Requests</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.title}</td>
                      <td>{request.customer?.name}</td>
                      <td>{request.category}</td>
                      <td>
                        <Badge bg={
                          request.status === 'OPEN' ? 'warning' :
                          request.status === 'BOOKED' ? 'info' : 'success'
                        }>
                          {request.status}
                        </Badge>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="bookings" title="Bookings">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Bookings</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Worker</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.serviceRequest?.title}</td>
                      <td>{booking.customer?.name}</td>
                      <td>{booking.worker?.name}</td>
                      <td>${booking.paymentAmount || booking.quote?.price}</td>
                      <td>
                        <Badge bg={booking.status === 'COMPLETED' ? 'success' : 'info'}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EnhancedDashboard;