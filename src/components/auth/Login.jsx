import { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { setToken, setUser } from '../../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await authService.login(formData);
  //     const { token, user } = response.data;
      
  //     setToken(token);
  //     setUser(user);
      
  //     // Redirect based on role
  //     switch (user.role) {
  //       case 'admin':
  //         navigate('/admin/dashboard');
  //         break;
  //       case 'worker':
  //         navigate('/worker/requests');
  //         break;
  //       default:
  //         navigate('/customer/requests');
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await authService.login(formData);
    const { token, user } = response.data;
    
    // Use the new setter functions that emit events
    setToken(token);
    setUser(user);
    
    // Redirect based on role
    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'worker':
        navigate('/worker/requests');
        break;
      default:
        navigate('/customer/requests');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;