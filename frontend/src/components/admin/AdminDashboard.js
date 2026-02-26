// src/components/admin/AdminDashboard.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaUsers, 
  FaBuilding,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaUserTie,
  FaUserCheck,
  FaShieldAlt,
  FaSearch,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaFileAlt,
  FaBell,
  FaTimes
} from 'react-icons/fa';
import './Admin.css';

const AdminDashboard = () => {
  // Stats utama
  const stats = {
    totalCompanies: 24,
    totalUsers: 156,
    totalAuditors: 8,
    activeAudits: 12,
    completedAudits: 45,
    complianceRate: 76,
    criticalFindings: 8,
    highFindings: 23,
    mediumFindings: 45,
    lowFindings: 34
  };

  // Recent companies
  const recentCompanies = [
    { id: 1, name: 'Tech Corp', compliance: 82, status: 'active', findings: 15 },
    { id: 2, name: 'Finance Ltd', compliance: 64, status: 'active', findings: 23 },
    { id: 3, name: 'HealthCare Inc', compliance: 45, status: 'warning', findings: 31 },
    { id: 4, name: 'EduGlobal', compliance: 91, status: 'active', findings: 8 },
    { id: 5, name: 'Retail Solutions', compliance: 38, status: 'inactive', findings: 42 }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'New company registered', company: 'TechStart', time: '10 minutes ago', type: 'register' },
    { id: 2, action: 'Audit completed', company: 'Finance Ltd', time: '1 hour ago', type: 'audit' },
    { id: 3, action: 'Critical finding reported', company: 'HealthCare Inc', time: '3 hours ago', type: 'finding' },
    { id: 4, action: 'Evidence uploaded', company: 'Tech Corp', time: '5 hours ago', type: 'evidence' },
    { id: 5, action: 'New auditor added', company: 'CyberGuard', time: '1 day ago', type: 'user' }
  ];

  // Upcoming audits
  const upcomingAudits = [
    { id: 1, company: 'Tech Corp', auditor: 'Dr. Robert Wilson', dueDate: '2024-03-01', priority: 'high' },
    { id: 2, company: 'Finance Ltd', auditor: 'Lisa Anderson', dueDate: '2024-03-05', priority: 'critical' },
    { id: 3, company: 'HealthCare Inc', auditor: 'Michael Chen', dueDate: '2024-02-28', priority: 'high' }
  ];

  // Top auditors
  const topAuditors = [
    { id: 1, name: 'Dr. Robert Wilson', completed: 12, rating: 4.8 },
    { id: 2, name: 'Lisa Anderson', completed: 8, rating: 4.9 },
    { id: 3, name: 'Michael Chen', completed: 6, rating: 4.7 }
  ];

  // Compliance by company
  const complianceByCompany = [
    { company: 'Tech Corp', compliance: 82, status: 'Good', change: '+5%' },
    { company: 'Finance Ltd', compliance: 64, status: 'Average', change: '-2%' },
    { company: 'HealthCare Inc', compliance: 45, status: 'Poor', change: '+3%' },
    { company: 'EduGlobal', compliance: 91, status: 'Excellent', change: '+8%' },
    { company: 'Retail Solutions', compliance: 38, status: 'Critical', change: '-5%' }
  ];

  // ========== STATE UNTUK MODAL ==========
  const [modalData, setModalData] = useState({
    show: false,
    title: '',
    items: []
  });

  // ========== DATA DETAIL UNTUK SETIAP STAT ==========
  const getDetailData = (type) => {
    switch(type) {
      case 'companies':
        return {
          title: 'Companies Overview',
          items: recentCompanies
        };
      case 'users':
        return {
          title: 'Users Overview',
          items: [
            { id: 1, name: 'John Smith', email: 'john@techcorp.com', role: 'auditee', status: 'active' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah@finance.com', role: 'auditee', status: 'active' },
            { id: 3, name: 'Dr. Robert Wilson', email: 'robert@cyber.com', role: 'auditor', status: 'active' },
            { id: 4, name: 'Lisa Anderson', email: 'lisa@cyber.com', role: 'auditor', status: 'active' },
            { id: 5, name: 'Michael Chen', email: 'michael@cyber.com', role: 'auditor', status: 'active' }
          ]
        };
      case 'auditors':
        return {
          title: 'Auditors Overview',
          items: topAuditors
        };
      case 'audits':
        return {
          title: 'Active Audits',
          items: upcomingAudits
        };
      case 'critical':
        return {
          title: 'Critical Findings',
          items: [
            { id: 1, finding: 'SQL Injection', company: 'Tech Corp', asset: 'Web Server', severity: 'Critical' },
            { id: 2, finding: 'Missing HTTPS', company: 'Finance Ltd', asset: 'API Gateway', severity: 'Critical' }
          ]
        };
      case 'high':
        return {
          title: 'High Findings',
          items: [
            { id: 1, finding: 'Weak Password Policy', company: 'Finance Ltd', asset: 'HR System', severity: 'High' },
            { id: 2, finding: 'Default Credentials', company: 'HealthCare Inc', asset: 'Database', severity: 'High' }
          ]
        };
      case 'completed':
        return {
          title: 'Completed Audits',
          items: [
            { id: 1, company: 'Retail Solutions', completed: '2024-02-15', findings: 12 },
            { id: 2, company: 'Tech Corp', completed: '2024-02-10', findings: 8 }
          ]
        };
      case 'compliance':
        return {
          title: 'Compliance Overview',
          items: complianceByCompany
        };
      default:
        return { title: '', items: [] };
    }
  };

  // ========== HANDLE KLIK STATS ==========
  const handleStatClick = (type) => {
    const data = getDetailData(type);
    setModalData({
      show: true,
      title: data.title,
      items: data.items
    });
  };

  // ========== MODAL COMPONENT ==========
  const DetailModal = () => {
    if (!modalData.show) return null;

    return (
      <div className="modal-overlay" onClick={() => setModalData({...modalData, show: false})}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{modalData.title}</h3>
            <button className="close-btn" onClick={() => setModalData({...modalData, show: false})}>
              <FaTimes />
            </button>
          </div>
          
          <div className="modal-body">
            {modalData.items.length === 0 ? (
              <p className="no-data">No data available</p>
            ) : (
              <table className="detail-table">
                <thead>
                  <tr>
                    {Object.keys(modalData.items[0]).map(key => (
                      <th key={key}>{key.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modalData.items.map((item, idx) => (
                    <tr key={idx}>
                      {Object.values(item).map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-dashboard">
        {/* Header with Search */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Admin! Here's what's happening with your platform.</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Stats Cards - SEKARANG BISA DI KLIK */}
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={() => handleStatClick('companies')}>
            <div className="stat-icon blue">
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>{stats.totalCompanies}</h3>
              <p>Total Companies</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +12.5%
            </div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('users')}>
            <div className="stat-icon green">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +8.2%
            </div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('auditors')}>
            <div className="stat-icon purple">
              <FaUserTie />
            </div>
            <div className="stat-content">
              <h3>{stats.totalAuditors}</h3>
              <p>Active Auditors</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +2
            </div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('audits')}>
            <div className="stat-icon orange">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <h3>{stats.activeAudits}</h3>
              <p>Active Audits</p>
            </div>
            <div className="stat-trend down">
              <FaArrowDown /> -2
            </div>
          </div>
        </div>

        {/* Second Row Stats - SEKARANG BISA DI KLIK */}
        <div className="stats-grid secondary">
          <div className="stat-card clickable" onClick={() => handleStatClick('critical')}>
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.criticalFindings}</h3>
              <p>Critical Findings</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +3
            </div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('high')}>
            <div className="stat-icon yellow">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.highFindings}</h3>
              <p>High Findings</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +5
            </div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('completed')}>
            <div className="stat-icon blue">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.completedAudits}</h3>
              <p>Completed Audits</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +8
            </div>
          </div>

          {/* Avg Compliance - SEKARANG BISA DI KLIK */}
          <div className="stat-card clickable" onClick={() => handleStatClick('compliance')}>
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.complianceRate}%</h3>
              <p>Avg Compliance</p>
            </div>
            <div className="stat-trend up">
              <FaArrowUp /> +5.2%
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Companies */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBuilding /> Recent Companies</h3>
              <a href="/admin/companies" className="view-all">View All →</a>
            </div>
            <div className="company-list">
              {recentCompanies.map(company => (
                <div key={company.id} className="company-item">
                  <div className="company-info">
                    <h4>{company.name}</h4>
                    <div className="company-meta">
                      <span className={`status-badge ${company.status}`}>
                        {company.status}
                      </span>
                      <span className="findings">{company.findings} findings</span>
                    </div>
                  </div>
                  <div className="company-compliance">
                    <div className="progress-circle">
                      <svg viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="3"
                          strokeDasharray={`${company.compliance}, 100`}
                        />
                      </svg>
                      <span>{company.compliance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Audits */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClock /> Upcoming Audits</h3>
              <a href="/admin/audits" className="view-all">View All →</a>
            </div>
            <div className="upcoming-list">
              {upcomingAudits.map(audit => (
                <div key={audit.id} className="upcoming-item">
                  <div className="audit-info">
                    <h4>{audit.company}</h4>
                    <p>{audit.auditor}</p>
                  </div>
                  <div className="audit-meta">
                    <span className={`priority-badge ${audit.priority}`}>
                      {audit.priority}
                    </span>
                    <span className="due-date">Due: {audit.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Grid Row */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBell /> Recent Activities</h3>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}></div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.action}</p>
                    <p className="activity-meta">{activity.company}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Auditors */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaUserTie /> Top Auditors</h3>
              <a href="/admin/auditors" className="view-all">View All →</a>
            </div>
            <div className="auditor-list">
              {topAuditors.map(auditor => (
                <div key={auditor.id} className="auditor-item">
                  <div className="auditor-avatar">
                    {auditor.name.charAt(0)}
                  </div>
                  <div className="auditor-info">
                    <h4>{auditor.name}</h4>
                    <p>{auditor.completed} audits completed</p>
                  </div>
                  <div className="auditor-rating">
                    <span className="rating">{auditor.rating}</span>
                    <span className="star">★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Findings Distribution */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3><FaChartBar /> Findings Distribution</h3>
            <a href="/admin/reports" className="view-all">View Report →</a>
          </div>
          <div className="findings-distribution">
            <div className="finding-stat">
              <span className="finding-label">Critical</span>
              <span className="finding-value">{stats.criticalFindings}</span>
              <div className="progress-bar">
                <div className="progress-fill critical" style={{width: '15%'}}></div>
              </div>
            </div>
            <div className="finding-stat">
              <span className="finding-label">High</span>
              <span className="finding-value">{stats.highFindings}</span>
              <div className="progress-bar">
                <div className="progress-fill high" style={{width: '25%'}}></div>
              </div>
            </div>
            <div className="finding-stat">
              <span className="finding-label">Medium</span>
              <span className="finding-value">{stats.mediumFindings}</span>
              <div className="progress-bar">
                <div className="progress-fill medium" style={{width: '35%'}}></div>
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

        {/* MODAL DETAIL */}
        <DetailModal />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;