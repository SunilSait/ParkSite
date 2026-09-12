/**
 * Admin API service.
 */

import API from './api';

const adminService = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  getBookings: (params) => API.get('/admin/bookings', { params }),
  getRevenue: (params) => API.get('/admin/revenue', { params }),
  // Slot management
  createSlot: (data) => API.post('/slots', data),
  updateSlot: (id, data) => API.put(`/slots/${id}`, data),
  deleteSlot: (id) => API.delete(`/slots/${id}`),
};

export default adminService;
