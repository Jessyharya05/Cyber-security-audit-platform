// src/components/auditee/CompanyFindings.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaShieldAlt,
  FaFileAlt,
  FaUpload,
  FaArrowRight
} from 'react-icons/fa';
import './Auditee.css';

const CompanyFindings = () => {
  const [findings, setFindings] = useState([
    {
      id: 1,
      title: 'SQL Injection Vulnerability',
      description: 'Web application vulnerable to SQL injection attacks',
      severity: 'critical',
      asset: 'Web Server',
      status: 'open',
      discovered: '2024-02-15',
      dueDate: '2024-03-01',
      auditor: 'Dr. Robert Wilson',
      recommendation: 'Implement parameterized queries and input validation',
      progress: 0
    },
    {
      id: 2,
      title: 'Weak Password Policy',
      description: 'Password policy does not enforce complexity requirements',
      severity: 'high',
      asset: 'HR System',
      status: 'in-progress',
      discovered: '2024-02-10',
      dueDate: '2024-02-28',
      auditor: 'Lisa Anderson',
      recommendation: 'Enforce minimum 12 characters with complexity',
      progress: 50
    },
    {
      id: 3,
      title: 'Missing HTTPS',
      description: 'API endpoints not using TLS encryption',
      severity: 'critical',
      asset: 'API Gateway',
      status: 'open',
      discovered: '2024-02-18',
      dueDate: '2024-03-05',
      auditor: 'Michael Chen',
      recommendation: 'Enable TLS 1.3 and force HTTPS',
      progress: 0
    },
    {
      id: 4,
      title: 'Default Credentials',
      description: 'Default admin credentials still active',
      severity: 'high',
      asset: 'Database',
      status: 'closed',
      discovered: '2024-02-05',
      dueDate: '2024-02-20',
      auditor: 'Dr. Robert Wilson',
      recommendation: 'Change all default passwords immediately',
      progress: 100
    },
    {
      id: 5,
      title: 'Open Ports Detected',
      description: 'Unnecessary ports open on firewall',
      severity: 'medium',
      asset: 'Firewall',
      status: 'in-progress',
      discovered: '2024-02-12',
      dueDate: '2024-03-10',
      auditor: 'Lisa Anderson',
      recommendation: 'Close unused ports and implement least privilege',
      progress: 30
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState({});

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || finding.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || finding.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical':
        return <span className="severity-badge critical">Critical</span>;
      case 'high':
        return <span className="severity-badge high">High</span>;
      case 'medium':
        return <span className="severity-badge medium">Medium</span>;
      case 'low':
        return <span className="severity-badge low">Low</span>;
      default:
        return <span className="severity-badge">{severity}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return <span className="status-badge critical"><FaExclamationTriangle /> Open</span>;
      case 'in-progress':
        return <span className="status-badge warning"><FaClock /> In Progress</span>;
      case 'closed':
        return <span className="status-badge good"><FaCheckCircle /> Closed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleViewDetails = (finding) => {
    setSelectedFinding(finding);
    setProgressUpdate({ progress: finding.progress, notes: '' });
    setShowDetails(true);
  };

  const handleUpdateProgress = () => {
    setFindings(findings.map(f => 
      f.id === selectedFinding.id 
        ? { ...f, progress: progressUpdate.progress }
        : f
    ));
  };

  const handleAddEvidence = () => {
    alert('Please go to Evidence page to upload remediation evidence');
  };

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaExclamationTriangle /> Audit Findings</h2>
            <p>View and remediate security findings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.status === 'open').length}</h3>
              <p>Open Findings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.status === 'closed').length}</h3>
              <p>Closed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaFlag />
            </div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.severity === 'critical').length}</h3>
              <p>Critical</p>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="severity-distribution">
          <div className="severity-bar">
            <div className="severity-segment critical" style={{width: '20%'}}>
              Critical {findings.filter(f => f.severity === 'critical').length}
            </div>
            <div className="severity-segment high" style={{width: '30%'}}>
              High {findings.filter(f => f.severity === 'high').length}
            </div>
            <div className="severity-segment medium" style={{width: '25%'}}>
              Medium {findings.filter(f => f.severity === 'medium').length}
            </div>
            <div className="severity-segment low" style={{width: '25%'}}>
              Low {findings.filter(f => f.severity === 'low').length}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="filter-box">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Findings List */}
        <div className="findings-container">
          {filteredFindings.map(finding => (
            <div key={finding.id} className={`finding-card ${finding.severity}`}>
              <div className="finding-header">
                <div className="finding-title">
                  <h3>{finding.title}</h3>
                  <span className="finding-id">#{finding.id}</span>
                </div>
                <div className="finding-badges">
                  {getSeverityBadge(finding.severity)}
                  {getStatusBadge(finding.status)}
                </div>
              </div>

              <div className="finding-body">
                <p className="finding-description">{finding.description}</p>
                
                <div className="finding-meta">
                  <div className="meta-item">
                    <span className="meta-label">Asset:</span>
                    <span className="meta-value">{finding.asset}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Discovered:</span>
                    <span className="meta-value">{finding.discovered}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Due Date:</span>
                    <span className={`meta-value ${new Date(finding.dueDate) < new Date() && finding.status !== 'closed' ? 'overdue' : ''}`}>
                      {finding.dueDate}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Auditor:</span>
                    <span className="meta-value">{finding.auditor}</span>
                  </div>
                </div>

                <div className="finding-progress">
                  <div className="progress-header">
                    <span>Remediation Progress</span>
                    <span>{finding.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${finding.status}`} 
                      style={{width: `${finding.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div className="finding-recommendation">
                  <strong>Recommendation:</strong> {finding.recommendation}
                </div>
              </div>

              <div className="finding-footer">
                <button className="btn-secondary" onClick={() => handleViewDetails(finding)}>
                  <FaEye /> View Details
                </button>
                {finding.status !== 'closed' && (
                  <button className="btn-primary" onClick={handleAddEvidence}>
                    <FaUpload /> Upload Evidence
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Finding Details Modal */}
        {showDetails && selectedFinding && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <h3>Finding Details</h3>
              
              <div className="finding-details">
                <div className="detail-section">
                  <h4>{selectedFinding.title}</h4>
                  <p>{selectedFinding.description}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Severity</label>
                    {getSeverityBadge(selectedFinding.severity)}
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    {getStatusBadge(selectedFinding.status)}
                  </div>
                  <div className="detail-item">
                    <label>Asset</label>
                    <span>{selectedFinding.asset}</span>
                  </div>
                  <div className="detail-item">
                    <label>Discovered</label>
                    <span>{selectedFinding.discovered}</span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date</label>
                    <span>{selectedFinding.dueDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Auditor</label>
                    <span>{selectedFinding.auditor}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Recommendation</h4>
                  <p>{selectedFinding.recommendation}</p>
                </div>

                <div className="detail-section">
                  <h4>Update Progress</h4>
                  <div className="progress-update">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressUpdate.progress}
                      onChange={(e) => setProgressUpdate({...progressUpdate, progress: parseInt(e.target.value)})}
                    />
                    <span>{progressUpdate.progress}%</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Remediation Notes</h4>
                  <textarea
                    rows="3"
                    placeholder="Add notes about remediation steps taken..."
                    value={progressUpdate.notes}
                    onChange={(e) => setProgressUpdate({...progressUpdate, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDetails(false)}>
                  Close
                </button>
                <button className="btn-primary" onClick={handleUpdateProgress}>
                  Update Progress
                </button>
                <button className="btn-primary" onClick={handleAddEvidence}>
                  <FaUpload /> Upload Evidence
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyFindings;