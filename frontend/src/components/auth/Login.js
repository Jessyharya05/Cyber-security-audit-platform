// src/components/auth/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaEnvelope, 
  FaLock, 
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaUserCheck,
  FaCrown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
try {
  const result = await login(formData.email, formData.password);
  if (result.success) {
    if (result.user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (result.user.role === 'auditor') {
      navigate('/auditor/dashboard');
    } else {
      navigate('/auditee/dashboard');
    }
  }
} catch (error) {
  // ✅ TANGKAP ERROR DENGAN BENER
  const errorMsg = error.response?.data?.detail || error.message || 'Invalid email or password';
  setError(errorMsg);
}
  };

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="brand-content">
          <div className="brand-icon">
            <FaShieldAlt />
          </div>
          <h1 className="brand-title">CyberGuard</h1>
          <p className="brand-subtitle">GRC PLATFORM · NIST CSF 2.0</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Risk Assessment with OWASP Top 10</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Complete NIST CSF Audit Checklist</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>AI Vulnerability Explainer</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Auto-generate PDF Audit Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="form-card">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>

          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field - Cara 1: Input biasa */}
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',  /* Pastikan padding cukup */
                  }}
                />
              </div>
            </div>

            {/* Atau Cara 2: Tampilan seperti screenshot (value saja tanpa input) */}
            {/* <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <div className="field-value-with-icon">
                <FaEnvelope />
                austin@cyberguard.com
              </div>
            </div> */}

            {/* Password Field */}
            <div className="form-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',  /* Pastikan padding cukup */
                    paddingRight: '50px', /* Ruang untuk toggle button */
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-section">
            <p className="demo-title">Demo Access</p>
            <div className="demo-buttons">
              <button className="demo-btn" onClick={() => {}}>
                <FaCrown /> Admin
              </button>
              <button className="demo-btn" onClick={() => {}}>
                <FaUserTie /> Auditor
              </button>
              <button className="demo-btn" onClick={() => {}}>
                <FaUserCheck /> Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;