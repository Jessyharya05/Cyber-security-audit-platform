// frontend/src/services/assetService.js
import api from './api';

export const assetService = {
  // Get all assets by company
  getByCompany: (companyId) => api.get(`/assets/company/${companyId}`),
  
  // Get single asset
  getById: (id) => api.get(`/assets/${id}`),
  
  // Create new asset
  create: (assetData) => api.post('/assets/', assetData),
  
  // Update asset
  update: (id, assetData) => api.put(`/assets/${id}`, assetData),
  
  // Delete asset
  delete: (id) => api.delete(`/assets/${id}`),
  
  // Get detailed risk analysis
  getRiskAnalysis: (id) => api.get(`/assets/${id}/risk-analysis`)
};