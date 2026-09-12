/**
 * Parking location API service.
 */

import API from './api';

const locationService = {
  getAll: (params) => API.get('/locations', { params }),
  getById: (id) => API.get(`/locations/${id}`),
  getSlots: (id, params) => API.get(`/locations/${id}/slots`, { params }),
  create: (data) => API.post('/locations', data),
  update: (id, data) => API.put(`/locations/${id}`, data),
  delete: (id) => API.delete(`/locations/${id}`),
};

export default locationService;
