import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Customer Pages
import ServiceRequestList from './components/customer/ServiceRequestList';
import CreateServiceRequest from './components/customer/CreateServiceRequest';
import ServiceRequestDetail from './components/customer/ServiceRequestDetail';
import BookingList from './components/customer/BookingList';

// Worker Pages
import AvailableRequests from './components/worker/AvailableRequests';
import WorkerBookings from './components/worker/WorkerBookings';

// Admin Pages
import AdminDashboard from './components/admin/Dashboard';

// Common Pages
import UserProfile from './components/common/UserProfile';

function App() {
  return (
    <div className="App">
      <AppNavbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer/requests" element={
          <PrivateRoute requiredRole="customer">
            <ServiceRequestList />
          </PrivateRoute>
        } />
        <Route path="/customer/requests/new" element={
          <PrivateRoute requiredRole="customer">
            <CreateServiceRequest />
          </PrivateRoute>
        } />
        <Route path="/customer/requests/:id" element={
          <PrivateRoute requiredRole="customer">
            <ServiceRequestDetail />
          </PrivateRoute>
        } />
        <Route path="/customer/bookings" element={
          <PrivateRoute requiredRole="customer">
            <BookingList />
          </PrivateRoute>
        } />

        {/* Worker Routes */}
        <Route path="/worker/requests" element={
          <PrivateRoute requiredRole="worker">
            <AvailableRequests />
          </PrivateRoute>
        } />
        <Route path="/worker/bookings" element={
          <PrivateRoute requiredRole="worker">
            <WorkerBookings />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Common Routes (accessible to all authenticated users) */}
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <div className="container text-center mt-5">
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary mt-3">
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;