// src/components/auditee/CompanyReports.js

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
  FaChartBar,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import './Auditee.css';

const CompanyReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const reports = [
    {
      id: 1,
      name: 'Company Compliance Report - February 2024',
      type: 'Compliance',
      generated: '2024-02-23',
      format: 'PDF',
      size: '1.8 MB',
      description: 'Overall compliance status and NIST CSF scores',
      compliance: 72,
      findings: 15
    },
    {
      id: 2,
      name: 'Asset Inventory Summary',
      type: 'Asset',
      generated: '2024-02-22',
      format: 'PDF',
      size: '1.2 MB',
      description: 'Complete list of all registered assets with CIA ratings',
      assets: 24,
      critical: 3
    },
    {
      id: 3,
      name: 'Findings Report - Q1 2024',
      type: 'Findings',
      generated: '2024-02-20',
      format: 'Excel',
      size: '2.1 MB',
      description: 'Detailed findings and remediation status',
      openFindings: 3,
      closedFindings: 2
    },
    {
      id: 4,
      name: 'Evidence Status Report',
      type: 'Evidence',
      generated: '2024-02-19',
      format: 'PDF',
      size: '0.9 MB',
      description: 'Status of all required evidence',
      pending: 4,
      uploaded: 2
    },
    {
      id: 5,
      name: 'Security Audit Summary - February 2024',
      type: 'Audit',
      generated: '2024-02-18',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Complete audit results and recommendations',
      auditor: 'Dr. Robert Wilson',
      score: 72
    }
  ];

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaFileAlt /> Company Reports</h2>
            <p>View and download audit reports</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>{reports.length}</h3>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3>72%</h3>
              <p>Compliance Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>3</h3>
              <p>Open Findings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>Feb 2024</h3>
              <p>Latest Report</p>
            </div>
          </div>
        </div>

        {/* Search */}
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
        </div>

        {/* Reports Grid */}
        <div className="reports-grid">
          {filteredReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-icon">
                {report.format === 'PDF' ? <FaFilePdf /> : <FaFileExcel />}
              </div>
              <div className="report-info">
                <h3>{report.name}</h3>
                <p>{report.description}</p>
                <div className="report-meta">
                  <span><FaCalendarAlt /> {report.generated}</span>
                  <span>{report.size}</span>
                </div>
                {report.compliance && (
                  <div className="report-compliance">
                    <span>Compliance Score</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${report.compliance}%`}}></div>
                    </div>
                    <span>{report.compliance}%</span>
                  </div>
                )}
              </div>
              <div className="report-actions">
                <button className="icon-btn" onClick={() => {setSelectedReport(report); setShowPreview(true);}}>
                  <FaEye />
                </button>
                <button className="icon-btn">
                  <FaDownload />
                </button>
                <button className="icon-btn">
                  <FaPrint />
                </button>
                <button className="icon-btn">
                  <FaShare />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report Preview Modal */}
        {showPreview && selectedReport && (
          <div className="modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <h3>Report Preview</h3>
              
              <div className="report-preview">
                <div className="preview-header">
                  <h2>{selectedReport.name}</h2>
                  <p>Generated: {selectedReport.generated} | Format: {selectedReport.format}</p>
                </div>

                <div className="preview-content">
                  <p>{selectedReport.description}</p>
                  
                  {selectedReport.compliance && (
                    <div className="preview-stats">
                      <div className="stat">
                        <label>Compliance Score</label>
                        <span>{selectedReport.compliance}%</span>
                      </div>
                      <div className="stat">
                        <label>Findings</label>
                        <span>{selectedReport.findings}</span>
                      </div>
                    </div>
                  )}

                  {selectedReport.assets && (
                    <div className="preview-stats">
                      <div className="stat">
                        <label>Total Assets</label>
                        <span>{selectedReport.assets}</span>
                      </div>
                      <div className="stat">
                        <label>Critical Assets</label>
                        <span>{selectedReport.critical}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowPreview(false)}>
                  Close
                </button>
                <button className="btn-primary">
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyReports;