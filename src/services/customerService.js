import api from './api';

export const customerService = {
  getMyRequests: () => api.get('/customer/requests'),
  getRequestById: (requestId) => api.get(`/customer/requests/${requestId}`),
  createServiceRequest: (data) => api.post('/customer/requests', data),
  getMyBookings: () => api.get('/customer/bookings'),
  createBooking: (data) => api.post('/customer/bookings', data),
  completeBooking: (bookingId, data) => api.post(`/customer/bookings/${bookingId}/complete`, data)
};