import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost/backend/api/auth/forgot-password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to send reset email');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="brand-content">
                    <div className="brand-icon">🔐</div>
                    <h1 className="brand-title">CyberGuard</h1>
                    <p className="brand-subtitle">Reset Your Password</p>
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="feature-check">✓</span>
                            <span>Enter your email address</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-check">✓</span>
                            <span>We'll send reset instructions</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-check">✓</span>
                            <span>Follow the link to reset</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="form-card">
                    <Link to="/login" className="back-link">
                        <FaArrowLeft /> Back to Login
                    </Link>

                    <div className="form-header">
                        <h2>Forgot Password?</h2>
                        <p>Enter your email to reset your password</p>
                    </div>

                    {error && (
                        <div className="error-alert">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="success-message">
                            <FaCheckCircle className="success-icon" />
                            <h3>Check Your Email</h3>
                            <p>We've sent password reset instructions to:</p>
                            <strong>{email}</strong>
                            <p className="note">Didn't receive the email? Check your spam folder or try again.</p>
                            <Link to="/login" className="btn-primary" style={{ marginTop: '20px', display: 'block', textAlign: 'center' }}>
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            paddingLeft: '50px',
                                            paddingRight: '20px',
                                            width: '100%',
                                            height: '44px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Instructions'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;