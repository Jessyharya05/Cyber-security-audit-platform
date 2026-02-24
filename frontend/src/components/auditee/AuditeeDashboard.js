// src/components/auditee/AuditeeDashboard.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaBuilding, 
  FaServer, 
  FaUpload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaBell,
  FaShieldAlt,
  FaChartBar
} from 'react-icons/fa';
import './Auditee.css';

const AuditeeDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats data
  const stats = {
    totalAssets: 24,
    pendingEvidence: 5,
    openFindings: 3,
    complianceRate: 72,
    criticalFindings: 1,
    highFindings: 2,
    mediumFindings: 3,
    lowFindings: 4
  };

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'Evidence uploaded', item: 'Password Policy Document', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'New finding reported', item: 'SQL Injection vulnerability', time: '1 day ago', status: 'warning' },
    { id: 3, action: 'Audit scheduled', item: 'Security Audit - Q1 2024', time: '2 days ago', status: 'info' },
    { id: 4, action: 'Finding resolved', item: 'Weak password policy', time: '3 days ago', status: 'success' }
  ];

  // Upcoming deadlines
  const deadlines = [
    { id: 1, task: 'Upload Firewall Configuration', due: '2024-03-01', daysLeft: 3, priority: 'high' },
    { id: 2, task: 'Submit Access Control List', due: '2024-03-03', daysLeft: 5, priority: 'medium' },
    { id: 3, task: 'Complete Self-Assessment', due: '2024-02-28', daysLeft: 1, priority: 'critical' }
  ];

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-dashboard">
        {/* Header with Search */}
        <div className="dashboard-header">
          <div>
            <h1>Company Dashboard</h1>
            <p>Welcome back! Manage your assets and audit evidence.</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search assets, evidence..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaServer />
            </div>
            <div className="stat-content">
              <h3>{stats.totalAssets}</h3>
              <p>Total Assets</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +3
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <FaUpload />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingEvidence}</h3>
              <p>Evidence Pending</p>
            </div>
            <div className="stat-trend down">
              <FaArrowDown /> -2
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.openFindings}</h3>
              <p>Open Findings</p>
            </div>
            <div className="stat-trend">
              {stats.criticalFindings} critical
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.complianceRate}%</h3>
              <p>Compliance Rate</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +5%
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* NIST CSF Compliance Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaChartBar /> NIST CSF Compliance</h3>
              <a href="/auditee/reports" className="view-all">View Report →</a>
            </div>
            <div className="compliance-bars">
              <div className="compliance-item">
                <span className="compliance-label">Identify</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '68%'}}></div>
                </div>
                <span className="compliance-value">68%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Protect</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '72%'}}></div>
                </div>
                <span className="compliance-value">72%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Detect</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '45%'}}></div>
                </div>
                <span className="compliance-value">45%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Respond</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '80%'}}></div>
                </div>
                <span className="compliance-value">80%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Recover</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '55%'}}></div>
                </div>
                <span className="compliance-value">55%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClock /> Upcoming Deadlines</h3>
              <a href="/auditee/evidence" className="view-all">View All →</a>
            </div>
            <div className="deadline-list">
              {deadlines.map(deadline => (
                <div key={deadline.id} className="deadline-item">
                  <div className="deadline-info">
                    <h4>{deadline.task}</h4>
                    <p>Due: {deadline.due}</p>
                  </div>
                  <div className="deadline-meta">
                    <span className={`priority-badge ${deadline.priority}`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Grid */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBell /> Recent Activities</h3>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.status}`}></div>
                  <div className="activity-content">
                    <h4>{activity.action}</h4>
                    <p>{activity.item}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings Summary */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaExclamationTriangle /> Findings by Severity</h3>
              <a href="/auditee/findings" className="view-all">View All →</a>
            </div>
            <div className="findings-summary">
              <div className="finding-stat">
                <span className="finding-label">Critical</span>
                <span className="finding-value">{stats.criticalFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill critical" style={{width: '20%'}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">High</span>
                <span className="finding-value">{stats.highFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill high" style={{width: '30%'}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">Medium</span>
                <span className="finding-value">{stats.mediumFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill medium" style={{width: '25%'}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">Low</span>
                <span className="finding-value">{stats.lowFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill low" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditeeDashboard;