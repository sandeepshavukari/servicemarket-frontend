import api from './api';

export const workerService = {
  getAvailableRequests: () => api.get('/worker/requests'),
  submitQuote: (data) => api.post('/worker/quotes', data),
  getMyBookings: () => api.get('/worker/bookings'),
  getQuotesForRequest: (requestId) => api.get(`/quotes/request/${requestId}`)
};