// frontend/src/services/authService.js
import api from './api';

export const authService = {
  // Register user baru
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user data
  getCurrentUser: () => api.get('/auth/me'),
  
  // Logout (client side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};