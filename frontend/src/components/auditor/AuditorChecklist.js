// src/components/auditor/AuditorChecklist.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaClipboardCheck,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaMinusCircle,
  FaEye,
  FaEdit,
  FaSave,
  FaBuilding,
  FaShieldAlt
} from 'react-icons/fa';
import './Auditor.css';

const AuditorChecklist = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFunction, setFilterFunction] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('Tech Corp');

  // NIST CSF Functions
  const nistFunctions = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

  // Companies
  const companies = ['Tech Corp', 'Finance Ltd', 'HealthCare Inc', 'EduGlobal'];

  // Audit Checklist Items
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 1,
      control: 'Asset Management (ID.AM-1)',
      description: 'Physical devices and systems within the organization are inventoried',
      function: 'Identify',
      company: 'Tech Corp',
      status: 'compliant',
      evidence: 'uploaded',
      auditor: 'Dr. Robert Wilson',
      lastUpdated: '2024-02-20'
    },
    {
      id: 2,
      control: 'Risk Assessment (ID.RA-1)',
      description: 'Asset vulnerabilities are identified and documented',
      function: 'Identify',
      company: 'Tech Corp',
      status: 'partially',
      evidence: 'pending',
      auditor: 'Dr. Robert Wilson',
      lastUpdated: '2024-02-19'
    },
    {
      id: 3,
      control: 'Access Control (PR.AC-1)',
      description: 'Identities and credentials are managed for authorized devices and users',
      function: 'Protect',
      company: 'Tech Corp',
      status: 'non-compliant',
      evidence: 'missing',
      auditor: 'Dr. Robert Wilson',
      lastUpdated: '2024-02-18'
    },
    {
      id: 4,
      control: 'Data Security (PR.DS-1)',
      description: 'Data-at-rest is protected',
      function: 'Protect',
      company: 'Finance Ltd',
      status: 'compliant',
      evidence: 'uploaded',
      auditor: 'Lisa Anderson',
      lastUpdated: '2024-02-21'
    },
    {
      id: 5,
      control: 'Security Continuous Monitoring (DE.CM-1)',
      description: 'The network is monitored to detect potential cybersecurity events',
      function: 'Detect',
      company: 'Finance Ltd',
      status: 'partially',
      evidence: 'pending',
      auditor: 'Lisa Anderson',
      lastUpdated: '2024-02-20'
    },
    {
      id: 6,
      control: 'Response Planning (RS.RP-1)',
      description: 'Response plan is executed during or after an incident',
      function: 'Respond',
      company: 'HealthCare Inc',
      status: 'non-compliant',
      evidence: 'missing',
      auditor: 'Michael Chen',
      lastUpdated: '2024-02-19'
    },
    {
      id: 7,
      control: 'Recovery Planning (RC.RP-1)',
      description: 'Recovery plan is executed during or after an incident',
      function: 'Recover',
      company: 'HealthCare Inc',
      status: 'compliant',
      evidence: 'uploaded',
      auditor: 'Michael Chen',
      lastUpdated: '2024-02-22'
    }
  ]);

  const filteredItems = checklistItems.filter(item => {
    const matchesSearch = item.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFunction = filterFunction === 'all' || item.function === filterFunction;
    const matchesCompany = item.company === selectedCompany;
    return matchesSearch && matchesFunction && matchesCompany;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'compliant': return <FaCheckCircle className="status-icon compliant" />;
      case 'partially': return <FaMinusCircle className="status-icon partially" />;
      case 'non-compliant': return <FaTimesCircle className="status-icon non-compliant" />;
      default: return null;
    }
  };

  const getEvidenceBadge = (evidence) => {
    switch(evidence) {
      case 'uploaded': return <span className="evidence-badge good">Evidence Uploaded</span>;
      case 'pending': return <span className="evidence-badge warning">Pending</span>;
      case 'missing': return <span className="evidence-badge critical">Missing</span>;
      default: return null;
    }
  };

  const updateStatus = (id, newStatus) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : item
      )
    );
  };

  return (
    <DashboardLayout role="auditor">
      <div className="auditor-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaClipboardCheck /> NIST CSF Audit Checklist</h2>
            <p>Verify security controls implementation</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary"><FaSave /> Save Progress</button>
          </div>
        </div>

        {/* Company Selector */}
        <div className="company-selector">
          <label><FaBuilding /> Select Company:</label>
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            {companies.map(company => <option key={company} value={company}>{company}</option>)}
          </select>
        </div>

        {/* NIST Functions Overview */}
        <div className="nist-functions-overview">
          {nistFunctions.map(func => {
            const total = checklistItems.filter(i => i.function === func && i.company === selectedCompany).length;
            const compliant = checklistItems.filter(i => i.function === func && i.company === selectedCompany && i.status === 'compliant').length;
            const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;
            
            return (
              <div key={func} className="function-card">
                <h4>{func}</h4>
                <div className="function-stats">
                  <span className="function-percent">{percentage}%</span>
                  <span className="function-count">{compliant}/{total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${percentage}%`}}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterFunction} onChange={(e) => setFilterFunction(e.target.value)}>
              <option value="all">All Functions</option>
              {nistFunctions.map(func => <option key={func} value={func}>{func}</option>)}
            </select>
          </div>
        </div>

        {/* Checklist Table */}
        <div className="table-container">
          <table className="auditor-table">
            <thead>
              <tr>
                <th>Control ID</th>
                <th>Description</th>
                <th>Function</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.control}</strong></td>
                  <td>{item.description}</td>
                  <td>
                    <span className="function-badge">{item.function}</span>
                  </td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(item.status)}
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="compliant">Compliant</option>
                        <option value="partially">Partially Compliant</option>
                        <option value="non-compliant">Non-Compliant</option>
                      </select>
                    </div>
                  </td>
                  <td>{getEvidenceBadge(item.evidence)}</td>
                  <td>{item.lastUpdated}</td>
                  <td>
                    <button className="icon-btn"><FaEye /></button>
                    <button className="icon-btn"><FaEdit /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance Summary */}
        <div className="compliance-summary">
          <h3>Overall Compliance</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Compliant</span>
              <span className="stat-value">
                {checklistItems.filter(i => i.company === selectedCompany && i.status === 'compliant').length}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Partially</span>
              <span className="stat-value">
                {checklistItems.filter(i => i.company === selectedCompany && i.status === 'partially').length}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Non-Compliant</span>
              <span className="stat-value">
                {checklistItems.filter(i => i.company === selectedCompany && i.status === 'non-compliant').length}
              </span>
            </div>
            <div className="summary-stat total">
              <span className="stat-label">Compliance Rate</span>
              <span className="stat-value">
                {Math.round((checklistItems.filter(i => i.company === selectedCompany && i.status === 'compliant').length / 
                  checklistItems.filter(i => i.company === selectedCompany).length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorChecklist;