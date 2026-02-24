// src/components/auditor/AuditorRiskAssessment.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaChartBar,
  FaBug,
  FaShieldAlt,
  FaArrowRight,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import './Auditor.css';

const AuditorRiskAssessment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState('all');

  // OWASP Top 10 Vulnerabilities
  const vulnerabilities = [
    {
      id: 1,
      name: 'SQL Injection',
      category: 'Injection',
      asset: 'Web Server',
      likelihood: 'High',
      impact: 'Critical',
      risk: 'Critical',
      cvss: 9.0,
      status: 'open',
      discovered: '2024-02-20'
    },
    {
      id: 2,
      name: 'Weak Password Policy',
      category: 'Broken Authentication',
      asset: 'HR System',
      likelihood: 'High',
      impact: 'High',
      risk: 'High',
      cvss: 7.5,
      status: 'in-progress',
      discovered: '2024-02-18'
    },
    {
      id: 3,
      name: 'XSS Vulnerability',
      category: 'Cross-Site Attacks',
      asset: 'Customer Portal',
      likelihood: 'Medium',
      impact: 'Medium',
      risk: 'Medium',
      cvss: 6.5,
      status: 'open',
      discovered: '2024-02-19'
    },
    {
      id: 4,
      name: 'Missing HTTPS',
      category: 'Sensitive Data Exposure',
      asset: 'API Gateway',
      likelihood: 'High',
      impact: 'Critical',
      risk: 'Critical',
      cvss: 8.5,
      status: 'open',
      discovered: '2024-02-17'
    },
    {
      id: 5,
      name: 'Default Credentials',
      category: 'Security Misconfiguration',
      asset: 'Database',
      likelihood: 'Medium',
      impact: 'High',
      risk: 'High',
      cvss: 7.0,
      status: 'closed',
      discovered: '2024-02-15'
    },
    {
      id: 6,
      name: 'Broken Access Control',
      category: 'Access Control',
      asset: 'Admin Panel',
      likelihood: 'High',
      impact: 'Critical',
      risk: 'Critical',
      cvss: 8.9,
      status: 'open',
      discovered: '2024-02-21'
    },
    {
      id: 7,
      name: 'Security Logging Failure',
      category: 'Logging',
      asset: 'All Systems',
      likelihood: 'Medium',
      impact: 'Medium',
      risk: 'Medium',
      cvss: 5.5,
      status: 'in-progress',
      discovered: '2024-02-16'
    },
    {
      id: 8,
      name: 'Outdated Components',
      category: 'Dependencies',
      asset: 'Web Server',
      likelihood: 'High',
      impact: 'High',
      risk: 'High',
      cvss: 7.8,
      status: 'open',
      discovered: '2024-02-22'
    }
  ];

  // Assets for filter
  const assets = ['Web Server', 'HR System', 'Customer Portal', 'API Gateway', 'Database', 'Admin Panel'];

  // Risk Matrix Data
  const riskMatrix = {
    critical: vulnerabilities.filter(v => v.risk === 'Critical').length,
    high: vulnerabilities.filter(v => v.risk === 'High').length,
    medium: vulnerabilities.filter(v => v.risk === 'Medium').length,
    low: vulnerabilities.filter(v => v.risk === 'Low').length
  };

  const filteredVulns = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || vuln.risk === filterSeverity;
    const matchesAsset = selectedAsset === 'all' || vuln.asset === selectedAsset;
    return matchesSearch && matchesSeverity && matchesAsset;
  });

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Critical': return '#b91c1c';
      case 'High': return '#b45309';
      case 'Medium': return '#b68b40';
      default: return '#166534';
    }
  };

  return (
    <DashboardLayout role="auditor">
      <div className="auditor-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaExclamationTriangle /> Risk Assessment</h2>
            <p>OWASP Top 10 Vulnerability Management</p>
          </div>
          <button className="btn-primary">
            <FaPlus /> New Assessment
          </button>
        </div>

        {/* Risk Matrix */}
        <div className="risk-matrix-card">
          <h3>Risk Matrix (Likelihood × Impact)</h3>
          <div className="risk-matrix">
            <div className="matrix-row header">
              <div className="matrix-cell">Likelihood \ Impact</div>
              <div className="matrix-cell">Low</div>
              <div className="matrix-cell">Med</div>
              <div className="matrix-cell">High</div>
              <div className="matrix-cell">Crit</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-cell">High</div>
              <div className="matrix-cell low">2</div>
              <div className="matrix-cell medium">3</div>
              <div className="matrix-cell high">4</div>
              <div className="matrix-cell critical">3</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-cell">Med</div>
              <div className="matrix-cell low">4</div>
              <div className="matrix-cell medium">5</div>
              <div className="matrix-cell high">3</div>
              <div className="matrix-cell critical">2</div>
            </div>
            <div className="matrix-row">
              <div className="matrix-cell">Low</div>
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

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search vulnerabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="filter-box">
            <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
              <option value="all">All Assets</option>
              {assets.map(asset => <option key={asset} value={asset}>{asset}</option>)}
            </select>
          </div>
        </div>

        {/* Vulnerabilities Table */}
        <div className="table-container">
          <table className="auditor-table">
            <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Category</th>
                <th>Asset</th>
                <th>CVSS</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Discovered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVulns.map(vuln => (
                <tr key={vuln.id}>
                  <td><strong>{vuln.name}</strong></td>
                  <td>{vuln.category}</td>
                  <td>{vuln.asset}</td>
                  <td>{vuln.cvss}</td>
                  <td>
                    <span className="risk-badge" style={{
                      background: `${getRiskColor(vuln.risk)}20`,
                      color: getRiskColor(vuln.risk)
                    }}>
                      {vuln.risk}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${vuln.status}`}>
                      {vuln.status}
                    </span>
                  </td>
                  <td>{vuln.discovered}</td>
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
    </DashboardLayout>
  );
};

export default AuditorRiskAssessment;