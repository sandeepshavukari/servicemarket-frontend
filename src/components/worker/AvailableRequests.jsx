import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { workerService } from '../../services/workerService';
import SubmitQuoteModal from './SubmitQuoteModal';

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await workerService.getAvailableRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleQuoteSubmitted = () => {
    setShowModal(false);
    setSelectedRequest(null);
    fetchRequests(); // Refresh the list
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
      <h2 className="mb-4">Available Service Requests</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {requests.length === 0 ? (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h5>No available requests</h5>
                <p>All service requests have been taken or you've already submitted quotes for available ones.</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          requests.map((request) => (
            <Col md={6} lg={4} key={request.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{request.title}</Card.Title>
                  <Card.Text className="text-muted">{request.description}</Card.Text>
                  
                  <div className="mb-2">
                    <strong>Category:</strong> {request.category}
                  </div>
                  <div className="mb-2">
                    <strong>Urgency:</strong>{' '}
                    <Badge bg={
                      request.urgency === 'LOW' ? 'secondary' :
                      request.urgency === 'MEDIUM' ? 'info' :
                      request.urgency === 'HIGH' ? 'warning' : 'danger'
                    }>
                      {request.urgency}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <strong>Location:</strong> {request.location}
                  </div>
                  <div className="mb-3">
                    <strong>Quotes:</strong> {request.quotes?.length || 0}
                  </div>

                  <Button 
                    variant="primary" 
                    onClick={() => handleSubmitQuote(request)}
                    className="w-100"
                  >
                    Submit Quote
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <SubmitQuoteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        request={selectedRequest}
        onQuoteSubmitted={handleQuoteSubmitted}
      />
    </Container>
  );
};

export default AvailableRequests;