/**
 * Booking API service.
 */

import API from './api';

const bookingService = {
  create: (data) => API.post('/bookings', data),
  getAll: (params) => API.get('/bookings', { params }),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  demoPayment: (data) => API.post('/payments/demo', data),
};

export default bookingService;
