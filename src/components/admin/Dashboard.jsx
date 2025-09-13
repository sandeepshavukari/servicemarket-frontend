import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getPlatformStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
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

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, color: 'primary', icon: '👥' },
    { title: 'Customers', value: stats.customers, color: 'info', icon: '👤' },
    { title: 'Workers', value: stats.workers, color: 'warning', icon: '🔧' },
    { title: 'Admins', value: stats.admins, color: 'secondary', icon: '👑' },
    { title: 'Total Requests', value: stats.totalRequests, color: 'success', icon: '📋' },
    { title: 'Open Requests', value: stats.openRequests, color: 'primary', icon: '🔓' },
    { title: 'Booked Requests', value: stats.bookedRequests, color: 'info', icon: '📅' },
    { title: 'Total Bookings', value: stats.totalBookings, color: 'warning', icon: '💰' },
    { title: 'Completed Bookings', value: stats.completedBookings, color: 'success', icon: '✅' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'success', icon: '💵' }
  ];

  return (
    <Container>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row>
        {statCards.map((stat, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <Card className={`border-${stat.color} h-100`}>
              <Card.Body className="text-center">
                <div className="display-4 mb-2">{stat.icon}</div>
                <h3 className={`text-${stat.color}`}>{stat.value}</h3>
                <Card.Title>{stat.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;