// frontend/src/services/reportService.js
import api from './api';

export const reportService = {
  // Generate audit report
  generate: (auditId) => api.post(`/reports/generate/${auditId}`),
  
  // Download report
  download: (reportId) => api.get(`/reports/${reportId}/download`, {
    responseType: 'blob'
  }),
  
  // Get all reports
  getAll: () => api.get('/reports/')
};