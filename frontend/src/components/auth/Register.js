// src/components/auth/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaUser, 
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

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'auditee'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const result = await register(formData, formData.role);
      if (result.success) {
        if (formData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (formData.role === 'auditor') {
          navigate('/auditor/dashboard');
        } else {
          navigate('/auditee/dashboard');
        }
      }
    } catch (error) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Side - Branding */}
      <div className="register-left">
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

      {/* Right Side - Register Form */}
      <div className="register-right">
        <div className="form-card">
          <div className="form-header">
            <h2>Create New Account</h2>
            <p>Select your role to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label>FULL NAME</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',
                    paddingRight: '20px',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>EMAIL</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="email@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',
                    paddingRight: '20px',
                  }}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label>SELECT ROLE</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, role: 'admin'})}
                >
                  <FaCrown />
                  ADMIN
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'auditor' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, role: 'auditor'})}
                >
                  <FaUserTie />
                  AUDITOR
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'auditee' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, role: 'auditee'})}
                >
                  <FaUserCheck />
                  AUDITEE
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',
                    paddingRight: '50px', // Ruang untuk toggle button
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

            {/* Confirm Password */}
            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '50px',
                    paddingRight: '50px', // Ruang untuk toggle button
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="register-submit-btn"
              disabled={!agreeTerms || loading}
            >
              {loading ? 'Creating Account...' : '+ Create Account'}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;