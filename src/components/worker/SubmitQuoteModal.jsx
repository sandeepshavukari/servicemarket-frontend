import { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { workerService } from '../../services/workerService';

const SubmitQuoteModal = ({ show, onHide, request, onQuoteSubmitted }) => {
  const [formData, setFormData] = useState({
    price: '',
    description: '',
    estimatedDuration: ''
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
    if (!request) return;

    setLoading(true);
    setError('');

    try {
      const quoteData = {
        requestId: request.id,
        ...formData,
        price: parseFloat(formData.price)
      };

      await workerService.submitQuote(quoteData);
      onQuoteSubmitted();
      setFormData({ price: '', description: '', estimatedDuration: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quote');
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Submit Quote for: {request.title}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter your price quote"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your approach and what's included"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estimated Duration</Form.Label>
            <Form.Control
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              required
              placeholder="e.g., 2 hours, 1 day, 3-4 days"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Submit Quote'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SubmitQuoteModal;