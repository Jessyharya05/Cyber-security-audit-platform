// src/components/auditor/AuditorDashboard.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaClipboardCheck, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBuilding,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaBell,
  FaFileAlt,
  FaRobot
} from 'react-icons/fa';
import './Auditor.css';

const AuditorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats data
  const stats = {
    assignedAudits: 8,
    inProgress: 3,
    completed: 5,
    pendingReviews: 2,
    criticalFindings: 4,
    highFindings: 7,
    mediumFindings: 12,
    lowFindings: 8
  };

  // Assigned audits
  const assignedAudits = [
    { id: 1, company: 'Tech Corp', scope: 'Full Security Audit', progress: 75, dueDate: '2024-03-01', priority: 'high', findings: 12 },
    { id: 2, company: 'Finance Ltd', scope: 'Web App Security', progress: 30, dueDate: '2024-03-05', priority: 'critical', findings: 8 },
    { id: 3, company: 'HealthCare Inc', scope: 'Compliance Audit', progress: 90, dueDate: '2024-02-28', priority: 'high', findings: 15 },
    { id: 4, company: 'EduGlobal', scope: 'Network Security', progress: 45, dueDate: '2024-03-10', priority: 'medium', findings: 5 }
  ];

  // Recent findings
  const recentFindings = [
    { id: 1, title: 'SQL Injection Vulnerability', company: 'Tech Corp', severity: 'critical', asset: 'Web Server', date: '2024-02-23' },
    { id: 2, title: 'Weak Password Policy', company: 'Finance Ltd', severity: 'high', asset: 'HR System', date: '2024-02-22' },
    { id: 3, title: 'Missing HTTPS', company: 'HealthCare Inc', severity: 'critical', asset: 'API Gateway', date: '2024-02-21' },
    { id: 4, title: 'Open Ports Detected', company: 'EduGlobal', severity: 'medium', asset: 'Firewall', date: '2024-02-20' }
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, task: 'Submit Audit Report - Tech Corp', due: '2024-03-01', daysLeft: 5 },
    { id: 2, task: 'Review Evidence - Finance Ltd', due: '2024-03-03', daysLeft: 7 },
    { id: 3, task: 'Complete Checklist - HealthCare Inc', due: '2024-02-28', daysLeft: 2 },
    { id: 4, task: 'Client Meeting - EduGlobal', due: '2024-03-05', daysLeft: 9 }
  ];

  return (
    <DashboardLayout role="auditor">
      <div className="auditor-dashboard">
        {/* Header with Search */}
        <div className="dashboard-header">
          <div>
            <h1>Auditor Dashboard</h1>
            <p>Welcome back! Manage your audits and findings.</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search audits, companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaClipboardCheck />
            </div>
            <div className="stat-content">
              <h3>{stats.assignedAudits}</h3>
              <p>Assigned Audits</p>
            </div>
            <div className="stat-trend">Total</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +2
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +3
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.criticalFindings}</h3>
              <p>Critical Findings</p>
            </div>
            <div className="stat-trend down">
              <FaArrowDown /> -1
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Assigned Audits */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClipboardCheck /> Assigned Audits</h3>
              <a href="/auditor/risk-assessment" className="view-all">View All →</a>
            </div>
            <div className="audit-list">
              {assignedAudits.map(audit => (
                <div key={audit.id} className="audit-item">
                  <div className="audit-info">
                    <h4>{audit.company}</h4>
                    <p>{audit.scope}</p>
                  </div>
                  <div className="audit-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${audit.progress}%`}}></div>
                    </div>
                    <span className="progress-text">{audit.progress}%</span>
                  </div>
                  <div className="audit-meta">
                    <span className={`priority-badge ${audit.priority}`}>{audit.priority}</span>
                    <span className="findings">{audit.findings} findings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Findings */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaExclamationTriangle /> Recent Findings</h3>
              <a href="/auditor/reports" className="view-all">View All →</a>
            </div>
            <div className="findings-list">
              {recentFindings.map(finding => (
                <div key={finding.id} className="finding-item">
                  <div className="finding-info">
                    <h4>{finding.title}</h4>
                    <p>{finding.company} - {finding.asset}</p>
                  </div>
                  <div className="finding-meta">
                    <span className={`severity-badge ${finding.severity}`}>
                      {finding.severity}
                    </span>
                    <span className="finding-date">{finding.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Grid */}
        <div className="dashboard-grid">
          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClock /> Upcoming Deadlines</h3>
            </div>
            <div className="deadline-list">
              {upcomingDeadlines.map(deadline => (
                <div key={deadline.id} className="deadline-item">
                  <div className="deadline-info">
                    <h4>{deadline.task}</h4>
                    <p>Due: {deadline.due}</p>
                  </div>
                  <div className="deadline-meta">
                    <span className={`days-badge ${deadline.daysLeft <= 3 ? 'urgent' : ''}`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaRobot /> Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => window.location.href = '/auditor/risk-assessment'}>
                <FaClipboardCheck />
                <span>Start Risk Assessment</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/auditor/checklist'}>
                <FaCheckCircle />
                <span>Open Checklist</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/auditor/ai-assistant'}>
                <FaRobot />
                <span>Ask AI Assistant</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/auditor/reports'}>
                <FaFileAlt />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorDashboard;