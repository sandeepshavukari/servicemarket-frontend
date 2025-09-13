import { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { customerService } from '../../services/customerService';

const CompleteBookingModal = ({ show, onHide, booking, onBookingCompleted }) => {
  const [formData, setFormData] = useState({
    paymentAmount: '',
    feedback: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking) return;

    setLoading(true);
    setError('');

    try {
      const completionData = {
        ...formData,
        paymentAmount: parseFloat(formData.paymentAmount)
      };

      await customerService.completeBooking(booking.id, completionData);
      onBookingCompleted();
      setFormData({ paymentAmount: '', feedback: '', rating: 5 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Complete Booking</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <h5>{booking.serviceRequest?.title}</h5>
          <p className="text-muted">with {booking.worker?.name}</p>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  required
                  placeholder="Enter amount paid"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rating (1-5)</Form.Label>
                <Form.Select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Share your experience with this service..."
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Complete Booking'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompleteBookingModal;