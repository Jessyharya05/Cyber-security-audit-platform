// frontend/src/services/auditService.js
import api from './api';

export const auditService = {
  // Get all audits
  getAll: () => api.get('/audit/'),
  
  // Get audit by ID
  getById: (id) => api.get(`/audit/${id}`),
  
  // Schedule new audit
  schedule: (auditData) => api.post('/audit/', auditData),
  
  // Update audit status
  updateStatus: (id, status) => api.put(`/audit/${id}`, { status }),
  
  // Get findings by audit
  getFindings: (auditId) => api.get(`/audit/findings/${auditId}`),
  
  // Create finding
  createFinding: (findingData) => api.post('/audit/findings', findingData)
};