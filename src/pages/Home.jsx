import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuth, user } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">
                Find Trusted Service Professionals
              </h1>
              <p className="lead mb-4">
                Connect with skilled workers for all your home service needs. 
                From plumbing to electrical work, we've got you covered.
              </p>
              {!isAuth ? (
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Button variant="light" size="lg" as={Link} to="/register">
                    Get Started
                  </Button>
                  <Button variant="outline-light" size="lg" as={Link} to="/login">
                    Sign In
                  </Button>
                </div>
              ) : (
                <Button variant="light" size="lg" as={Link} to={
                  user.role === 'customer' ? '/customer/requests' :
                  user.role === 'worker' ? '/worker/requests' : '/admin/dashboard'
                }>
                  Go to Dashboard
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2>How It Works</h2>
            <p className="lead">Simple steps to get your services done</p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">📋</div>
            <h4>1. Post a Request</h4>
            <p>Describe the service you need and get quotes from professionals.</p>
          </Col>
          
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">💬</div>
            <h4>2. Receive Quotes</h4>
            <p>Compare quotes from verified service providers in your area.</p>
          </Col>
          
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">✅</div>
            <h4>3. Get it Done</h4>
            <p>Choose the best quote and get your service completed hassle-free.</p>
          </Col>
        </Row>
      </Container>

      {/* For Workers Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2>For Service Professionals</h2>
              <p className="lead">
                Join our platform to find new customers and grow your business.
              </p>
              <ul className="list-unstyled">
                <li>✅ Find local service requests</li>
                <li>✅ Set your own prices</li>
                <li>✅ Build your reputation</li>
                <li>✅ Get paid securely</li>
              </ul>
              {!isAuth && (
                <Button variant="primary" as={Link} to="/register">
                  Sign Up as Worker
                </Button>
              )}
            </Col>
            <Col lg={6} className="text-center">
              <div className="display-1">🔧</div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;