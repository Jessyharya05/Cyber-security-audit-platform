// src/components/admin/AdminAudits.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaClipboardList, 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaChartBar,
  FaPlay,
  FaPause,
  FaStop
} from 'react-icons/fa';
import './Admin.css';

const AdminAudits = () => {
  const [audits, setAudits] = useState([
    { 
      id: 1, 
      company: 'Tech Corp', 
      auditor: 'Dr. Robert Wilson',
      scope: 'Full Security Audit',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      status: 'in-progress',
      progress: 75,
      findings: 8,
      criticalFindings: 2,
      checklists: 45,
      completedChecklists: 34,
      lastActivity: '2024-02-23'
    },
    { 
      id: 2, 
      company: 'Finance Ltd', 
      auditor: 'Lisa Anderson',
      scope: 'Web Application Security',
      startDate: '2024-02-05',
      endDate: '2024-03-05',
      status: 'in-progress',
      progress: 30,
      findings: 5,
      criticalFindings: 1,
      checklists: 38,
      completedChecklists: 12,
      lastActivity: '2024-02-22'
    },
    { 
      id: 3, 
      company: 'HealthCare Inc', 
      auditor: 'Michael Chen',
      scope: 'Compliance Audit',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      status: 'review',
      progress: 90,
      findings: 12,
      criticalFindings: 3,
      checklists: 42,
      completedChecklists: 38,
      lastActivity: '2024-02-23'
    },
    { 
      id: 4, 
      company: 'EduGlobal', 
      auditor: 'Sarah Williams',
      scope: 'Network Security',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      status: 'pending',
      progress: 0,
      findings: 0,
      criticalFindings: 0,
      checklists: 35,
      completedChecklists: 0,
      lastActivity: '2024-02-10'
    },
    { 
      id: 5, 
      company: 'Retail Solutions', 
      auditor: 'Dr. Robert Wilson',
      scope: 'PCI DSS Compliance',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'completed',
      progress: 100,
      findings: 15,
      criticalFindings: 4,
      checklists: 40,
      completedChecklists: 40,
      lastActivity: '2024-02-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.auditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || audit.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="status-badge good"><FaCheckCircle /> Completed</span>;
      case 'in-progress': return <span className="status-badge warning"><FaPlay /> In Progress</span>;
      case 'review': return <span className="status-badge purple"><FaClock /> Under Review</span>;
      case 'pending': return <span className="status-badge"><FaPause /> Pending</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
    setShowDetails(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaClipboardList /> Audits Management</h2>
            <p>Monitor and manage all security audit activities</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowScheduleModal(true)}>
              <FaPlus /> Schedule Audit
            </button>
            <button className="btn-secondary">
              <FaDownload /> Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards - KHUSUS AUDITS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <h3>{audits.length}</h3>
              <p>Total Audits</p>
            </div>
            <div className="stat-trend">+3 this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{audits.filter(a => a.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaPlay />
            </div>
            <div className="stat-content">
              <h3>{audits.filter(a => a.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{audits.filter(a => a.status === 'review').length}</h3>
              <p>Under Review</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search audits by company or auditor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Audits Table - KHUSUS data audit */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Auditor</th>
                <th>Scope</th>
                <th>Period</th>
                <th>Progress</th>
                <th>Checklists</th>
                <th>Findings</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map(audit => (
                <tr key={audit.id}>
                  <td><strong><FaBuilding /> {audit.company}</strong></td>
                  <td><FaUserTie /> {audit.auditor}</td>
                  <td>{audit.scope}</td>
                  <td>
                    <FaCalendarAlt /> {audit.startDate} - {audit.endDate}
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${audit.progress}%`}}></div>
                      </div>
                      <span>{audit.progress}%</span>
                    </div>
                  </td>
                  <td>{audit.completedChecklists}/{audit.checklists}</td>
                  <td>
                    <div className="findings-stack">
                      <span className="critical-badge-small">{audit.criticalFindings} C</span>
                      <span className="finding-count">{audit.findings} Total</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(audit.status)}</td>
                  <td>{audit.lastActivity}</td>
                  <td>
                    <button className="icon-btn" onClick={() => handleViewDetails(audit)}><FaEye /></button>
                    <button className="icon-btn"><FaEdit /></button>
                    <button className="icon-btn"><FaFileAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Details Modal - Fitur KHUSUS Audits */}
        {showDetails && selectedAudit && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <h3><FaClipboardList /> Audit Details: {selectedAudit.company}</h3>
              
              <div className="audit-details">
                <div className="detail-section">
                  <h4>Audit Information</h4>
                  <div className="detail-grid">
                    <div><label>Auditor:</label> {selectedAudit.auditor}</div>
                    <div><label>Scope:</label> {selectedAudit.scope}</div>
                    <div><label>Period:</label> {selectedAudit.startDate} to {selectedAudit.endDate}</div>
                    <div><label>Status:</label> {getStatusBadge(selectedAudit.status)}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Progress Overview</h4>
                  <div className="progress-detailed">
                    <div className="progress-item">
                      <label>Overall Progress</label>
                      <div className="progress-bar-large">
                        <div className="progress-fill" style={{width: `${selectedAudit.progress}%`}}></div>
                        <span>{selectedAudit.progress}%</span>
                      </div>
                    </div>
                    <div className="progress-item">
                      <label>Checklists Completed</label>
                      <div className="progress-bar-large">
                        <div className="progress-fill" style={{width: `${(selectedAudit.completedChecklists/selectedAudit.checklists)*100}%`}}></div>
                        <span>{selectedAudit.completedChecklists}/{selectedAudit.checklists}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Findings Summary</h4>
                  <div className="findings-chart">
                    <div className="finding-bar critical" style={{width: `${(selectedAudit.criticalFindings/selectedAudit.findings)*100}%`}}>
                      Critical: {selectedAudit.criticalFindings}
                    </div>
                    <div className="finding-bar high" style={{width: `${((selectedAudit.findings - selectedAudit.criticalFindings)/selectedAudit.findings)*100}%`}}>
                      Others: {selectedAudit.findings - selectedAudit.criticalFindings}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDetails(false)}>Close</button>
                <button className="btn-primary">View Full Report</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAudits;