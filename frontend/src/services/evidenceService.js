// frontend/src/services/evidenceService.js
import api from './api';

export const evidenceService = {
  // Upload evidence file
  upload: (formData) => api.post('/evidence/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Get all evidence by company
  getByCompany: (companyId) => api.get(`/evidence/company/${companyId}`),
  
  // Get single evidence by ID
  getById: (id) => api.get(`/evidence/${id}`),
  
  // Download evidence file
  download: (id) => api.get(`/evidence/${id}/download`, {
    responseType: 'blob'
  }),
  
  // Delete evidence
  delete: (id) => api.delete(`/evidence/${id}`)
};