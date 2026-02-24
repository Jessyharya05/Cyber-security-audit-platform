import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaClipboardCheck, 
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaRobot,
  FaArrowRight,
  FaBuilding,
  FaChartBar,
  FaDownload,
  FaFilter,
  FaBug,
  FaShieldAlt,
  FaPlus,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import './Dashboard.css';

const AuditorDashboard = () => {
  // Stats
  const stats = {
    assignedAudits: 12,
    inProgress: 5,
    completed: 7,
    openFindings: 23,
    criticalFindings: 4,
    highFindings: 8,
    mediumFindings: 7,
    lowFindings: 4
  };

  // MODULE 4: OWASP Vulnerabilities
  const [vulnerabilities] = useState([
    { id: 1, name: 'SQL Injection', asset: 'Web Server', likelihood: 'High', impact: 'Critical', risk: 'Critical', cvss: 9.0, category: 'Injection' },
    { id: 2, name: 'Weak Password Policy', asset: 'HR System', likelihood: 'High', impact: 'High', risk: 'High', cvss: 7.5, category: 'Broken Authentication' },
    { id: 3, name: 'XSS Vulnerability', asset: 'Customer Portal', likelihood: 'Medium', impact: 'Medium', risk: 'Medium', cvss: 6.5, category: 'Cross-Site Attacks' },
    { id: 4, name: 'Missing HTTPS', asset: 'API Gateway', likelihood: 'High', impact: 'Critical', risk: 'Critical', cvss: 8.5, category: 'Sensitive Data Exposure' },
    { id: 5, name: 'Default Credentials', asset: 'Database', likelihood: 'Medium', impact: 'High', risk: 'High', cvss: 7.0, category: 'Security Misconfiguration' }
  ]);

  // MODULE 5: Risk Matrix
  const riskMatrix = {
    critical: 3,
    high: 5,
    medium: 8,
    low: 4
  };

  // MODULE 6: Audit Checklist (NIST CSF)
  const [auditChecklist] = useState([
    { id: 1, control: 'Access Control (PR.AC)', category: 'Protect', status: 'non-compliant', asset: 'HR System', dueDate: '2024-03-01' },
    { id: 2, control: 'Encryption at Rest (PR.DS)', category: 'Protect', status: 'compliant', asset: 'Database', dueDate: '2024-03-05' },
    { id: 3, control: 'Audit Logging (DE.AE)', category: 'Detect', status: 'partially', asset: 'File Server', dueDate: '2024-02-28' },
    { id: 4, control: 'Backup Procedure (RC.RP)', category: 'Recover', status: 'non-compliant', asset: 'All Systems', dueDate: '2024-03-03' },
    { id: 5, control: 'Incident Response (RS.RP)', category: 'Respond', status: 'compliant', asset: 'All Systems', dueDate: '2024-03-02' },
    { id: 6, control: 'Asset Management (ID.AM)', category: 'Identify', status: 'compliant', asset: 'All Systems', dueDate: '2024-03-04' }
  ]);

  // Assigned Audits
  const assignedAudits = [
    { id: 1, company: 'Tech Corp', scope: 'Full Security Audit', progress: 75, dueDate: '2024-03-01', priority: 'high' },
    { id: 2, company: 'Finance Ltd', scope: 'Web App Security', progress: 30, dueDate: '2024-03-05', priority: 'critical' },
    { id: 3, company: 'HealthCare Inc', scope: 'Compliance Audit', progress: 90, dueDate: '2024-02-28', priority: 'high' },
    { id: 4, company: 'EduGlobal', scope: 'Network Security', progress: 15, dueDate: '2024-03-10', priority: 'medium' }
  ];

  // AI Suggestions
  const aiSuggestions = [
    'SQL Injection risk: Use parameterized queries',
    'Weak passwords: Implement MFA and password policy',
    'Missing encryption: Enable TLS 1.3',
    'Default credentials: Change all default passwords'
  ];

  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'critical': return '#b91c1c';
      case 'high': return '#b45309';
      case 'medium': return '#b68b40';
      default: return '#166534';
    }
  };

  const getNistFunctionColor = (category) => {
    switch(category) {
      case 'Identify': return '#4299e1';
      case 'Protect': return '#48bb78';
      case 'Detect': return '#ed8936';
      case 'Respond': return '#9f7aea';
      case 'Recover': return '#f56565';
      default: return '#64748b';
    }
  };

  return (
    <DashboardLayout role="auditor">
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Auditor Dashboard</h2>
            <p className="header-subtitle">Risk Assessment & Security Audit (NIST CSF)</p>
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
            <div className="stat-icon blue">
              <FaClipboardCheck />
            </div>
            <div className="stat-content">
              <h3>{stats.assignedAudits}</h3>
              <p>Assigned Audits</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.criticalFindings}</h3>
              <p>Critical Risks</p>
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
                   </div>
        </div>

        {/* MODULE 5: Risk Matrix */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h4><FaChartBar /> Risk Assessment Matrix (Likelihood × Impact)</h4>
            <button className="action-btn">Calculate Risk</button>
          </div>
          <div className="risk-matrix">
            <div className="matrix-row header">
              <div className="matrix-label">Likelihood \ Impact</div>
              <div className="matrix-label">Low</div>
              <div className="matrix-label">Med</div>
              <div className="matrix-label">High</div>
              <div className="matrix-label">Crit</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-label">High</div>
              <div className="matrix-cell low">2</div>
              <div className="matrix-cell medium">3</div>
              <div className="matrix-cell high">4</div>
              <div className="matrix-cell critical">3</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-label">Med</div>
              <div className="matrix-cell low">4</div>
              <div className="matrix-cell medium">5</div>
              <div className="matrix-cell high">3</div>
              <div className="matrix-cell critical">2</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-label">Low</div>
              <div className="matrix-cell low">6</div>
              <div className="matrix-cell low">4</div>
              <div className="matrix-cell medium">2</div>
              <div className="matrix-cell medium">1</div>
            </div>
          </div>
          <div className="risk-summary">
            <div className="risk-item">
              <span className="risk-label">Critical</span>
              <span className="risk-value">{riskMatrix.critical}</span>
            </div>
            <div className="risk-item">
              <span className="risk-label">High</span>
              <span className="risk-value">{riskMatrix.high}</span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Medium</span>
              <span className="risk-value">{riskMatrix.medium}</span>
            </div>
            <div className="risk-item">
              <span className="risk-label">Low</span>
              <span className="risk-value">{riskMatrix.low}</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* MODULE 4: OWASP Vulnerabilities */}
          <div className="card">
            <div className="card-header">
              <h4><FaBug /> OWASP Top 10 Vulnerabilities</h4>
              <div className="card-actions">
                <FaFilter style={{ color: '#64748b', cursor: 'pointer' }} />
                <button className="add-btn"><FaPlus /> Add</button>
              </div>
            </div>
            <div className="vuln-list">
              {vulnerabilities.map(vuln => (
                <div key={vuln.id} className="vuln-item">
                  <div className="vuln-info">
                    <div className="vuln-name">{vuln.name}</div>
                    <div className="vuln-asset">
                      <span className="vuln-category">{vuln.category}</span> · {vuln.asset} · CVSS: {vuln.cvss}
                    </div>
                  </div>
                  <div className="vuln-risk">
                    <span className="risk-badge" style={{
                      background: `${getRiskColor(vuln.risk)}20`,
                      color: getRiskColor(vuln.risk),
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {vuln.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="quick-action-btn" style={{ marginTop: '15px', width: '100%' }}>
              <FaRobot /> Run AI Vulnerability Scan
            </button>
          </div>

          {/* MODULE 6: Audit Checklist (NIST CSF) */}
          <div className="card">
            <div className="card-header">
              <h4><FaClipboardCheck /> NIST CSF Audit Checklist</h4>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="checklist-container">
              {auditChecklist.slice(0, 5).map(item => (
                <div key={item.id} className="checklist-item">
                  <div className="checklist-info">
                    <div className="checklist-control">{item.control}</div>
                    <div className="checklist-asset">
                      <span className="nist-badge" style={{
                        background: `${getNistFunctionColor(item.category)}20`,
                        color: getNistFunctionColor(item.category),
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        marginRight: '8px'
                      }}>
                        {item.category}
                      </span>
                      {item.asset} · Due {item.dueDate}
                    </div>
                  </div>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Audits */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h4><FaBuilding /> Assigned Audits</h4>
            <button className="add-btn"><FaPlus /> New Audit</button>
          </div>
          {assignedAudits.map(audit => (
            <div key={audit.id} className="audit-item">
              <div className="audit-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h5>{audit.company}</h5>
                  <span className={`priority-badge ${audit.priority}`}>{audit.priority}</span>
                </div>
                <p>{audit.scope} · Due {audit.dueDate}</p>
              </div>
              <div className="audit-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${audit.progress}%`}}></div>
                </div>
                <span className="progress-text">{audit.progress}%</span>
                <button className="icon-btn"><FaEye /></button>
                <button className="icon-btn"><FaEdit /></button>
              </div>
            </div>
          ))}
        </div>

        {/* MODULE 10: AI Assistant */}
        <div className="ai-assistant-card">
          <div className="ai-header">
            <FaRobot /> AI Auditor Assistant
          </div>
          <div className="ai-content">
            <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '13px' }}>
              Ask me about vulnerabilities, NIST CSF controls, or audit recommendations:
            </p>
            <div className="ai-suggestions">
              {aiSuggestions.map((suggestion, idx) => (
                <button key={idx} className="suggestion-chip">
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="ai-input" style={{ marginTop: '15px' }}>
              <input type="text" placeholder="e.g., Explain SQL Injection risk..." />
              <button>Ask AI</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn">
            <FaClipboardCheck />
            <span>Start Audit</span>
          </button>
          <button className="quick-action-btn">
            <FaRobot />
            <span>AI Analysis</span>
          </button>
          <button className="quick-action-btn">
            <FaFileAlt />
            <span>Generate Report</span>
          </button>
          <button className="quick-action-btn">
            <FaDownload />
            <span>Export Findings</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorDashboard;