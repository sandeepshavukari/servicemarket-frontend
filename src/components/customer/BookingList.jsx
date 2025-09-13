import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import CompleteBookingModal from './CompleteBookingModal';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await customerService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCompleteModal(true);
  };

  const handleBookingCompleted = () => {
    setShowCompleteModal(false);
    setSelectedBooking(null);
    fetchBookings(); // Refresh the list
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
                <p>You haven't made any bookings yet.</p>
                <Button as={Link} to="/customer/requests" variant="primary">
                  Browse Requests
                </Button>
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
                    <strong>Worker:</strong> {booking.worker?.name}
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
                  
                  <div className="mb-3">
                    <strong>Created:</strong>{' '}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>

                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      variant="success" 
                      onClick={() => handleCompleteBooking(booking)}
                      className="w-100"
                    >
                      Mark Complete
                    </Button>
                  )}

                  {booking.status === 'COMPLETED' && booking.paymentAmount && (
                    <div className="text-center">
                      <Badge bg="success" className="mb-2">
                        Paid: ${booking.paymentAmount}
                      </Badge>
                      {booking.rating && (
                        <div>
                          <small>Rating: {booking.rating}/5</small>
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

      <CompleteBookingModal
        show={showCompleteModal}
        onHide={() => setShowCompleteModal(false)}
        booking={selectedBooking}
        onBookingCompleted={handleBookingCompleted}
      />
    </Container>
  );
};

export default BookingList;