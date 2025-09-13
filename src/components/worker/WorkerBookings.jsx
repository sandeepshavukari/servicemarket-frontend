import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { workerService } from '../../services/workerService';

const WorkerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await workerService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
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
      <h2 className="mb-4">My Bookings</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {bookings.length === 0 ? (
          <Col>
            <Card>
              <Card.Body className="text-center">
                <h5>No bookings found</h5>
                <p>You haven't been booked for any services yet.</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          bookings.map((booking) => (
            <Col md={6} lg={4} key={booking.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{booking.serviceRequest?.title}</Card.Title>
                  
                  <div className="mb-2">
                    <strong>Customer:</strong> {booking.customer?.name}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Status:</strong>{' '}
                    <Badge bg={
                      booking.status === 'CONFIRMED' ? 'info' : 'success'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <strong>Price:</strong> ${booking.quote?.price}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Location:</strong> {booking.serviceRequest?.location}
                  </div>
                  
                  <div className="mb-3">
                    <strong>Created:</strong>{' '}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>

                  {booking.status === 'COMPLETED' && booking.rating && (
                    <div className="text-center">
                      <Badge bg="warning" className="mb-2">
                        Rating: {booking.rating}/5
                      </Badge>
                      {booking.feedback && (
                        <div>
                          <small>Feedback: "{booking.feedback}"</small>
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default WorkerBookings;