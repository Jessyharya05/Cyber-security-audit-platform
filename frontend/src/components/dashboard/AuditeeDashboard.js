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
  FaPlus,
  FaShieldAlt,
  FaDownload,
  FaUsers,
  FaGlobe,
  FaEdit,
  FaTrash,
  FaEye,
  FaCloudUploadAlt
} from 'react-icons/fa';
import './Dashboard.css';

const AuditeeDashboard = () => {
  // MODULE 2: Organization Profile
  const [orgProfile] = useState({
    name: 'Tech Solutions Inc',
    sector: 'Technology',
    employees: 150,
    systemType: 'Web Application & Cloud Services',
    exposureLevel: 'Medium',
    registrationDate: '2024-01-15',
    lastAudit: '2024-02-01'
  });

  // MODULE 3: Asset Inventory
  const [assets] = useState([
    { id: 1, name: 'Web Server', owner: 'IT Department', location: 'AWS Cloud', type: 'Server', cia: 'High', criticality: 8.5 },
    { id: 2, name: 'Customer Database', owner: 'IT Department', location: 'On-premise', type: 'Database', cia: 'Critical', criticality: 9.2 },
    { id: 3, name: 'HR Application', owner: 'HR Department', location: 'Cloud', type: 'Application', cia: 'Medium', criticality: 6.8 },
    { id: 4, name: 'Firewall', owner: 'IT Department', location: 'Network', type: 'Network Device', cia: 'High', criticality: 8.0 },
    { id: 5, name: 'Employee Portal', owner: 'IT Department', location: 'Cloud', type: 'Web App', cia: 'Medium', criticality: 7.2 }
  ]);

  // MODULE 7: Evidence Collection
  const [pendingEvidence] = useState([
    { id: 1, control: 'Password Policy Document', dueDate: '2024-03-01', status: 'pending', asset: 'HR System' },
    { id: 2, control: 'Backup Procedure', dueDate: '2024-03-03', status: 'uploaded', asset: 'Database' },
    { id: 3, control: 'Access Control List', dueDate: '2024-02-28', status: 'overdue', asset: 'File Server' },
    { id: 4, control: 'Firewall Configuration', dueDate: '2024-03-05', status: 'pending', asset: 'Network' },
    { id: 5, control: 'Incident Response Plan', dueDate: '2024-03-07', status: 'pending', asset: 'All Systems' }
  ]);

  // MODULE 9: Audit Findings
  const [findings] = useState([
    { id: 1, title: 'Weak Password Policy', severity: 'high', asset: 'HR System', status: 'open', discovered: '2024-02-15' },
    { id: 2, title: 'Missing Backup Configuration', severity: 'medium', asset: 'Database Server', status: 'in-progress', discovered: '2024-02-10' },
    { id: 3, title: 'Open Ports Detected', severity: 'low', asset: 'Web Server', status: 'closed', discovered: '2024-02-05' },
    { id: 4, title: 'Default Credentials', severity: 'critical', asset: 'Network Device', status: 'open', discovered: '2024-02-18' }
  ]);

  // Compliance Stats
  const complianceStats = {
    overall: 72,
    identify: 68,
    protect: 65,
    detect: 70,
    respond: 80,
    recover: 75
  };

  const getCiaColor = (cia) => {
    switch(cia.toLowerCase()) {
      case 'critical': return '#b91c1c';
      case 'high': return '#b45309';
      case 'medium': return '#b68b40';
      default: return '#166534';
    }
  };

  return (
    <DashboardLayout role="auditee">
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Company Dashboard</h2>
            <p className="header-subtitle">Manage your organization profile and audit evidence</p>
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

        {/* MODULE 2: Organization Profile Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h4><FaBuilding /> Organization Profile</h4>
            <button className="edit-btn"><FaEdit /> Edit Profile</button>
          </div>
          <div className="org-profile">
            <div className="profile-grid">
              <div className="profile-item">
                <span className="profile-label">Company Name</span>
                <span className="profile-value">{orgProfile.name}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Sector</span>
                <span className="profile-value">{orgProfile.sector}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Employees</span>
                <span className="profile-value">{orgProfile.employees}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">System Type</span>
                <span className="profile-value">{orgProfile.systemType}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Exposure Level</span>
                <span className={`exposure-badge ${orgProfile.exposureLevel.toLowerCase()}`}>
                  {orgProfile.exposureLevel}
                </span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Last Audit</span>
                <span className="profile-value">{orgProfile.lastAudit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaServer />
            </div>
            <div className="stat-content">
              <h3>{assets.length}</h3>
              <p>Total Assets</p>
            </div>
            <div className="stat-trend up">+2 this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaUpload />
            </div>
            <div className="stat-content">
              <h3>{pendingEvidence.filter(e => e.status === 'pending').length}</h3>
              <p>Evidence Pending</p>
            </div>
            <div className="stat-trend down">-1</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.status === 'open').length}</h3>
              <p>Open Findings</p>
            </div>
            <div className="stat-trend up">+2</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{complianceStats.overall}%</h3>
              <p>Compliance Rate</p>
            </div>
            <div className="stat-trend up">+5%</div>
          </div>
        </div>

        {/* NIST CSF Compliance Overview */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h4><FaShieldAlt /> NIST CSF Compliance by Function</h4>
          </div>
          <div className="nist-functions">
            <div className="function-item">
              <div className="function-info">
                <span className="function-name">Identify (ID)</span>
                <span className="function-percent">{complianceStats.identify}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${complianceStats.identify}%`, background: '#4299e1'}}></div>
              </div>
            </div>
            <div className="function-item">
              <div className="function-info">
                <span className="function-name">Protect (PR)</span>
                <span className="function-percent">{complianceStats.protect}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${complianceStats.protect}%`, background: '#48bb78'}}></div>
              </div>
            </div>
            <div className="function-item">
              <div className="function-info">
                <span className="function-name">Detect (DE)</span>
                <span className="function-percent">{complianceStats.detect}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${complianceStats.detect}%`, background: '#ed8936'}}></div>
              </div>
            </div>
            <div className="function-item">
              <div className="function-info">
                <span className="function-name">Respond (RS)</span>
                <span className="function-percent">{complianceStats.respond}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${complianceStats.respond}%`, background: '#9f7aea'}}></div>
              </div>
            </div>
            <div className="function-item">
              <div className="function-info">
                <span className="function-name">Recover (RC)</span>
                <span className="function-percent">{complianceStats.recover}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${complianceStats.recover}%`, background: '#f56565'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* MODULE 3: Asset Inventory */}
          <div className="card">
            <div className="card-header">
              <h4><FaServer /> Asset Inventory</h4>
              <button className="add-btn"><FaPlus /> Add Asset</button>
            </div>
            <div className="table-responsive">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>CIA</th>
                    <th>Criticality</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id}>
                      <td><strong>{asset.name}</strong></td>
                      <td>{asset.owner}</td>
                      <td>{asset.type}</td>
                      <td>{asset.location}</td>
                      <td>
                        <span className="cia-badge" style={{
                          background: `${getCiaColor(asset.cia)}20`,
                          color: getCiaColor(asset.cia),
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px'
                        }}>
                          {asset.cia}
                        </span>
                      </td>
                      <td>{asset.criticality}</td>
                      <td>
                        <button className="icon-btn"><FaEye /></button>
                        <button className="icon-btn"><FaEdit /></button>
                        <button className="icon-btn"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODULE 7: Evidence Collection */}
          <div className="card">
            <div className="card-header">
              <h4><FaUpload /> Evidence Required</h4>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="evidence-list">
              {pendingEvidence.slice(0, 4).map(evidence => (
                <div key={evidence.id} className="evidence-item">
                  <div className="evidence-info">
                    <div className="evidence-title">{evidence.control}</div>
                    <div className="evidence-meta">{evidence.asset} · Due: {evidence.dueDate}</div>
                  </div>
                  {evidence.status === 'uploaded' ? (
                    <span className="status-badge good">
                      <FaCheckCircle /> Uploaded
                    </span>
                  ) : evidence.status === 'overdue' ? (
                    <span className="status-badge critical">
                      <FaExclamationTriangle /> Overdue
                    </span>
                  ) : (
                    <button className="upload-btn">
                      <FaCloudUploadAlt /> Upload
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODULE 9: Audit Findings */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h4><FaExclamationTriangle /> Audit Findings</h4>
            <a href="#" className="view-all">View All</a>
          </div>
          <div className="findings-list">
            {findings.map(finding => (
              <div key={finding.id} className="finding-item">
                <div className="finding-content">
                  <div className="finding-title">{finding.title}</div>
                  <div className="finding-meta">
                    {finding.asset} · Discovered: {finding.discovered}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`severity-badge ${finding.severity}`}>
                    {finding.severity}
                  </span>
                  <span className={`status-badge ${finding.status}`}>
                    {finding.status}
                  </span>
                  <button className="icon-btn"><FaEye /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn">
            <FaPlus />
            <span>Add Asset</span>
          </button>
          <button className="quick-action-btn">
            <FaUpload />
            <span>Upload Evidence</span>
          </button>
          <button className="quick-action-btn">
            <FaFileAlt />
            <span>View Report</span>
          </button>
          <button className="quick-action-btn">
            <FaDownload />
            <span>Export Data</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditeeDashboard;