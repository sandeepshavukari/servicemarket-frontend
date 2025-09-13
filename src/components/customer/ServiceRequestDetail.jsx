import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge, Modal, Form } from 'react-bootstrap';
import { customerService } from '../../services/customerService';
import { workerService } from '../../services/workerService';

const ServiceRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      // Fetch request details
      const requestResponse = await customerService.getMyRequests();
      const foundRequest = requestResponse.data.find(req => req.id === parseInt(id));
      
      if (!foundRequest) {
        setError('Service request not found');
        setLoading(false);
        return;
      }

      setRequest(foundRequest);

      // Fetch quotes for this request
      const quotesResponse = await workerService.getQuotesForRequest(parseInt(id));
      setQuotes(quotesResponse.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch request details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (quote) => {
    setSelectedQuote(quote);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      const bookingData = {
        requestId: parseInt(id),
        quoteId: selectedQuote.id
      };

      await customerService.createBooking(bookingData);
      setShowBookingModal(false);
      navigate('/customer/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
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
        <Button variant="secondary" onClick={() => navigate('/customer/requests')}>
          Back to Requests
        </Button>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container>
        <Alert variant="warning">Service request not found</Alert>
        <Button variant="secondary" onClick={() => navigate('/customer/requests')}>
          Back to Requests
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button variant="outline-secondary" onClick={() => navigate('/customer/requests')} className="mb-3">
        ← Back to Requests
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2>{request.title}</h2>
              <Badge bg={
                request.status === 'OPEN' ? 'warning' :
                request.status === 'BOOKED' ? 'info' : 'success'
              }>
                {request.status}
              </Badge>
            </div>
            <small className="text-muted">
              Created: {new Date(request.createdAt).toLocaleDateString()}
            </small>
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Category:</strong> {request.category}
            </Col>
            <Col md={6}>
              <strong>Urgency:</strong> {request.urgency}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Location:</strong> {request.location}
            </Col>
          </Row>

          <div className="mb-3">
            <strong>Description:</strong>
            <p>{request.description}</p>
          </div>

          {request.photoUrl && (
            <div className="mb-3">
              <strong>Photo:</strong>
              <div>
                <img 
                  src={`http://localhost:8080${request.photoUrl}`} 
                  alt="Service request" 
                  style={{ maxWidth: '300px', maxHeight: '300px' }}
                  className="img-fluid rounded"
                />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <h3 className="mb-3">Quotes ({quotes.length})</h3>

      {quotes.length === 0 ? (
        <Alert variant="info">
          No quotes have been submitted for this request yet.
        </Alert>
      ) : (
        quotes.map((quote) => (
          <Card key={quote.id} className="mb-3">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h5>{quote.workerName}</h5>
                  <p className="mb-1">{quote.description}</p>
                  <small className="text-muted">
                    Estimated: {quote.estimatedDuration}
                  </small>
                </Col>
                <Col md={2} className="text-center">
                  <h4 className="text-primary">${quote.price}</h4>
                </Col>
                <Col md={2}>
                  {request.status === 'OPEN' && (
                    <Button 
                      variant="primary" 
                      onClick={() => handleBookService(quote)}
                    >
                      Book Now
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Booking Confirmation Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuote && (
            <>
              <p>You are about to book:</p>
              <h5>{request.title}</h5>
              <p>with <strong>{selectedQuote.workerName}</strong></p>
              <p>Price: <strong>${selectedQuote.price}</strong></p>
              <p>Estimated duration: {selectedQuote.estimatedDuration}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceRequestDetail;