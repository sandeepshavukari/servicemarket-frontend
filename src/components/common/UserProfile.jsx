import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // In a real app, you'd have an update profile endpoint
    try {
      // Simulate update
      setTimeout(() => {
        setSuccess('Profile updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Alert variant="danger">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">User Profile</h3>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={profile.name}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={profile.email}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <div>
                    <Badge bg={
                      profile.role === 'customer' ? 'primary' :
                      profile.role === 'worker' ? 'warning' : 'danger'
                    }>
                      {profile.role?.toUpperCase()}
                    </Badge>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Member Since</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={new Date(profile.createdAt).toLocaleDateString()}
                    disabled
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;