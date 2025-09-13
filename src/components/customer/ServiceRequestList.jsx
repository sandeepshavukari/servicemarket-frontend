import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../hooks/useAuth';

const ServiceRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await customerService.getMyRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Service Requests</h2>
        <Button variant="primary" href="/customer/requests/new">
          Create New Request
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {requests.length === 0 ? (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h5>No service requests found</h5>
                <p>Create your first service request to get started!</p>
                <Button variant="primary" href="/customer/requests/new">
                  Create Request
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          requests.map((request) => (
            <Col md={6} lg={4} key={request.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{request.title}</Card.Title>
                  <Card.Text>{request.description}</Card.Text>
                  <div className="mb-2">
                    <strong>Category:</strong> {request.category}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong>{' '}
                    <span className={`badge bg-${
                      request.status === 'OPEN' ? 'warning' :
                      request.status === 'BOOKED' ? 'info' : 'success'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Quotes:</strong> {request.quotes?.length || 0}
                  </div>
                  <Button variant="outline-primary" size="sm" href={`/customer/requests/${request.id}`}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ServiceRequestList;