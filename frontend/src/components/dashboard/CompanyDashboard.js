// src/components/dashboard/CompanyDashboard.js

import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaServer,
  FaBug,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaRobot,
  FaClipboardCheck,
  FaArrowUp,
  FaArrowDown,
  FaUserPlus,
  FaDownload
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalAssets: 42,
    totalEmployees: user?.employeeCount || 150,
    vulnerabilities: 15,
    complianceRate: 68,
    openFindings: 8,
    criticalRisks: 2,
    highRisks: 5,
    mediumRisks: 6,
    lowRisks: 2,
    pendingAudits: 3,
    completedAudits: 7
  });

  const [nistFunctions] = useState([
    { name: 'Identify', compliance: 70, color: '#4299e1' },
    { name: 'Protect', compliance: 65, color: '#48bb78' },
    { name: 'Detect', compliance: 45, color: '#ed8936' },
    { name: 'Respond', compliance: 80, color: '#9f7aea' },
    { name: 'Recover', compliance: 50, color: '#f56565' }
  ]);

  const [recentActivities] = useState([
    { id: 1, type: 'warning', title: 'Critical vulnerability', description: 'SQL Injection in web app', time: '1 hour ago' },
    { id: 2, type: 'success', title: 'Audit completed', description: 'Network security audit passed', time: '3 hours ago' },
    { id: 3, type: 'info', title: 'New user added', description: 'John joined IT department', time: '5 hours ago' }
  ]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Company Dashboard</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Welcome back, <strong>{user?.name}</strong>! Here's your security status
          </p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)' }}>
            <FaServer />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAssets}</h3>
            <p>Total Assets</p>
          </div>
          <div className="stat-trend trend-up">
            <FaArrowUp /> +4
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)' }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEmployees}</h3>
            <p>Employees</p>
          </div>
          <div className="stat-trend trend-up">
            <FaArrowUp /> +5
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #c05621 100%)' }}>
            <FaBug />
          </div>
          <div className="stat-content">
            <h3>{stats.vulnerabilities}</h3>
            <p>Vulnerabilities</p>
          </div>
          <div className="stat-trend trend-down">
            <FaArrowDown /> -3
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' }}>
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>{stats.complianceRate}%</h3>
            <p>Compliance Rate</p>
          </div>
          <div className="stat-trend trend-up">
            <FaArrowUp /> +5%
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          {/* NIST CSF Functions */}
          <div className="card">
            <div className="card-header">
              <h4>NIST CSF Compliance</h4>
              <span className="badge">Your Company</span>
            </div>
            <div className="nist-functions">
              {nistFunctions.map((func, index) => (
                <div key={index} className="nist-function-item">
                  <div className="function-info">
                    <div className="function-name">
                      <span className={`function-dot ${func.name.toLowerCase()}`}></span>
                      {func.name}
                    </div>
                    <div className="function-percent">{func.compliance}%</div>
                  </div>
                  <div className="progress-wrapper">
                    <div 
                      className={`progress-bar-custom ${func.name.toLowerCase()}`}
                      style={{ width: `${func.compliance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card" style={{ marginTop: '25px' }}>
            <div className="card-header">
              <h4>Recent Activities</h4>
              <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>View All</a>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'warning' && <FaExclamationTriangle />}
                    {activity.type === 'success' && <FaCheckCircle />}
                    {activity.type === 'info' && <FaShieldAlt />}
                  </div>
                  <div className="activity-content">
                    <h6>{activity.title}</h6>
                    <p>{activity.description}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Risk Distribution */}
          <div className="card">
            <div className="card-header">
              <h4>Risk Distribution</h4>
            </div>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#dc3545' }}>Critical</span>
                  <strong>{stats.criticalRisks}</strong>
                </div>
                <div className="progress-wrapper">
                  <div style={{ width: `${(stats.criticalRisks/15)*100}%`, height: '8px', background: '#dc3545', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#fd7e14' }}>High</span>
                  <strong>{stats.highRisks}</strong>
                </div>
                <div className="progress-wrapper">
                  <div style={{ width: `${(stats.highRisks/15)*100}%`, height: '8px', background: '#fd7e14', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#ffc107' }}>Medium</span>
                  <strong>{stats.mediumRisks}</strong>
                </div>
                <div className="progress-wrapper">
                  <div style={{ width: `${(stats.mediumRisks/15)*100}%`, height: '8px', background: '#ffc107', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#28a745' }}>Low</span>
                  <strong>{stats.lowRisks}</strong>
                </div>
                <div className="progress-wrapper">
                  <div style={{ width: `${(stats.lowRisks/15)*100}%`, height: '8px', background: '#28a745', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>

            <div className="risk-summary">
              <div className="risk-item">
                <span className="risk-label">Overall Risk Score</span>
                <span className="risk-value">58</span>
              </div>
              <div className="risk-item">
                <span className="risk-label">Risk Level</span>
                <span className="risk-badge medium">MEDIUM</span>
              </div>
            </div>
          </div>

          {/* Audit Status */}
          <div className="card" style={{ marginTop: '25px' }}>
            <div className="card-header">
              <h4>Audit Status</h4>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: '#667eea' }}>
                {stats.completedAudits}/{stats.completedAudits + stats.pendingAudits}
              </div>
              <p>Audits Completed</p>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 20px', 
                background: stats.pendingAudits > 0 ? '#fff3e6' : '#e6f7e6',
                color: stats.pendingAudits > 0 ? '#fd7e14' : '#28a745',
                borderRadius: '20px',
                marginTop: '10px'
              }}>
                {stats.pendingAudits} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn">
          <FaRobot />
          <span>AI Scan</span>
        </button>
        <button className="quick-action-btn">
          <FaUserPlus />
          <span>Add Employee</span>
        </button>
        <button className="quick-action-btn">
          <FaFileAlt />
          <span>Generate Report</span>
        </button>
        <button className="quick-action-btn">
          <FaDownload />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default CompanyDashboard;