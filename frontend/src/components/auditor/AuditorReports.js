// src/components/auditor/AuditorReports.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaFileAlt,
  FaSearch,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaShare,
  FaBuilding,
  FaUserTie,
  FaFilter,
  FaChartBar,
  FaChartPie,
  FaChartLine
} from 'react-icons/fa';
import './Auditor.css';

const AuditorReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Reports data
  const reports = [
    {
      id: 1,
      name: 'Tech Corp - Full Security Audit Report',
      type: 'Audit Report',
      company: 'Tech Corp',
      auditor: 'Dr. Robert Wilson',
      generated: '2024-02-23',
      dueDate: '2024-02-28',
      format: 'PDF',
      size: '2.4 MB',
      status: 'draft',
      findings: 15,
      compliance: 82,
      pages: 24
    },
    {
      id: 2,
      name: 'Finance Ltd - Web Application Security Assessment',
      type: 'Risk Assessment',
      company: 'Finance Ltd',
      auditor: 'Lisa Anderson',
      generated: '2024-02-22',
      dueDate: '2024-03-05',
      format: 'PDF',
      size: '1.8 MB',
      status: 'in-progress',
      findings: 23,
      compliance: 64,
      pages: 18
    },
    {
      id: 3,
      name: 'HealthCare Inc - Compliance Audit Q1 2024',
      type: 'Compliance Report',
      company: 'HealthCare Inc',
      auditor: 'Michael Chen',
      generated: '2024-02-21',
      dueDate: '2024-02-28',
      format: 'Excel',
      size: '3.2 MB',
      status: 'final',
      findings: 31,
      compliance: 45,
      pages: 32
    },
    {
      id: 4,
      name: 'EduGlobal - Network Security Assessment',
      type: 'Risk Assessment',
      company: 'EduGlobal',
      auditor: 'Dr. Robert Wilson',
      generated: '2024-02-20',
      dueDate: '2024-03-10',
      format: 'PDF',
      size: '1.2 MB',
      status: 'draft',
      findings: 8,
      compliance: 91,
      pages: 15
    },
    {
      id: 5,
      name: 'Quarterly Vulnerability Summary - Q1 2024',
      type: 'Summary Report',
      company: 'All Companies',
      auditor: 'System',
      generated: '2024-02-19',
      dueDate: '2024-02-29',
      format: 'Excel',
      size: '2.1 MB',
      status: 'final',
      findings: 78,
      compliance: 68,
      pages: 28
    }
  ];

  // Report templates for quick generation
  const reportTemplates = [
    { name: 'Audit Report', icon: <FaFileAlt />, color: 'blue' },
    { name: 'Risk Assessment', icon: <FaChartBar />, color: 'orange' },
    { name: 'Compliance Summary', icon: <FaChartPie />, color: 'green' },
    { name: 'Findings Analysis', icon: <FaChartLine />, color: 'purple' }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'final': return <span className="status-badge good">Final</span>;
      case 'draft': return <span className="status-badge">Draft</span>;
      case 'in-progress': return <span className="status-badge warning">In Progress</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <DashboardLayout role="auditor">
      <div className="auditor-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaFileAlt /> Audit Reports</h2>
            <p>Generate and manage audit reports</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">
              <FaFileAlt /> Generate New Report
            </button>
            <button className="btn-secondary">
              <FaDownload /> Export All
            </button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="report-templates">
          {reportTemplates.map((template, index) => (
            <div key={index} className={`template-card ${template.color}`}>
              <div className="template-icon">{template.icon}</div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>Generate new {template.name.toLowerCase()}</p>
              </div>
              <button className="template-btn">Create →</button>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Audit Report">Audit Report</option>
              <option value="Risk Assessment">Risk Assessment</option>
              <option value="Compliance Report">Compliance Report</option>
              <option value="Summary Report">Summary Report</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="table-container">
          <table className="auditor-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Company</th>
                <th>Auditor</th>
                <th>Generated</th>
                <th>Due Date</th>
                <th>Format</th>
                <th>Findings</th>
                <th>Compliance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id}>
                  <td><strong>{report.name}</strong></td>
                  <td><FaBuilding /> {report.company}</td>
                  <td><FaUserTie /> {report.auditor}</td>
                  <td><FaCalendarAlt /> {report.generated}</td>
                  <td>{report.dueDate}</td>
                  <td>
                    {report.format === 'PDF' ? 
                      <FaFilePdf className="pdf-icon" /> : 
                      <FaFileExcel className="excel-icon" />}
                    {report.format}
                  </td>
                  <td>{report.findings}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${report.compliance}%`}}></div>
                      </div>
                      <span>{report.compliance}%</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <button className="icon-btn" onClick={() => {setSelectedReport(report); setShowPreview(true);}}><FaEye /></button>
                    <button className="icon-btn"><FaDownload /></button>
                    <button className="icon-btn"><FaPrint /></button>
                    <button className="icon-btn"><FaShare /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Preview Modal */}
        {showPreview && selectedReport && (
          <div className="modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <div className="report-preview">
                <div className="preview-header">
                  <h2>{selectedReport.name}</h2>
                  <p>Generated: {selectedReport.generated} | Auditor: {selectedReport.auditor}</p>
                </div>

                <div className="preview-content">
                  <div className="preview-stats">
                    <div className="stat-box">
                      <label>Company</label>
                      <span>{selectedReport.company}</span>
                    </div>
                    <div className="stat-box">
                      <label>Findings</label>
                      <span>{selectedReport.findings}</span>
                    </div>
                    <div className="stat-box">
                      <label>Compliance</label>
                      <span>{selectedReport.compliance}%</span>
                    </div>
                    <div className="stat-box">
                      <label>Pages</label>
                      <span>{selectedReport.pages}</span>
                    </div>
                  </div>

                  <div className="preview-summary">
                    <h4>Executive Summary</h4>
                    <p>This report contains the findings and recommendations from the security audit of {selectedReport.company}. 
                    The overall compliance rate is {selectedReport.compliance}% with {selectedReport.findings} findings identified.</p>
                  </div>

                  <div className="preview-findings">
                    <h4>Top Findings</h4>
                    <ul>
                      <li>Critical: SQL Injection vulnerability in web application</li>
                      <li>High: Weak password policy not enforced</li>
                      <li>Medium: Missing security headers</li>
                      <li>Low: Outdated software versions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
                <button className="btn-primary"><FaDownload /> Download PDF</button>
                <button className="btn-primary"><FaPrint /> Print</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditorReports;