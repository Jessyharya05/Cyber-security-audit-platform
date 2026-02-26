// src/components/auditor/AuditorReports.js
import React, { useState, useEffect } from 'react';
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
  FaChartLine,
  FaTimes,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditor.css';

const AuditorReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reports, setReports] = useState([]);
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil audits yang diassign ke auditor ini
      const auditsRes = await api.get('/audit/');
      const myAudits = auditsRes.data?.filter(a => a.auditorId === user?.id) || [];
      setAudits(myAudits);
      
      // Generate reports dari audits
      const generatedReports = myAudits.map((audit, index) => ({
        id: audit.id,
        name: `${audit.companyName || 'Company'} - ${audit.scope || 'Audit Report'}`,
        type: 'Audit Report',
        company: audit.companyName || 'Unknown',
        auditor: user?.name,
        generated: audit.endDate || audit.startDate || new Date().toISOString().split('T')[0],
        dueDate: audit.dueDate || audit.endDate,
        format: index % 2 === 0 ? 'PDF' : 'Excel',
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        status: audit.status === 'completed' ? 'final' : audit.status === 'in-progress' ? 'draft' : 'in-progress',
        findings: audit.findings || Math.floor(Math.random() * 30) + 5,
        compliance: audit.compliance || Math.floor(Math.random() * 40) + 40,
        pages: Math.floor(Math.random() * 30) + 10
      }));
      
      setReports(generatedReports);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Report templates
  const reportTemplates = [
    { name: 'Audit Report', icon: <FaFileAlt />, color: 'blue', description: 'Detailed audit findings and recommendations' },
    { name: 'Risk Assessment', icon: <FaChartBar />, color: 'orange', description: 'Vulnerability analysis and risk scores' },
    { name: 'Compliance Summary', icon: <FaChartPie />, color: 'green', description: 'NIST CSF compliance overview' },
    { name: 'Findings Analysis', icon: <FaChartLine />, color: 'purple', description: 'Trend analysis of security findings' }
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

  const handleGenerateReport = (template) => {
    alert(`📄 Generating new ${template.name}... (Demo mode)`);
  };

  const handleDownload = (report, e) => {
    e.stopPropagation();
    alert(`📥 Downloading ${report.name}`);
  };

  const handlePreview = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handlePrint = (report, e) => {
    e.stopPropagation();
    alert(`🖨️ Printing ${report.name}`);
  };

  const handleShare = (report, e) => {
    e.stopPropagation();
    alert(`🔗 Share link copied for ${report.name}`);
  };

  if (loading) {
    return (
      <DashboardLayout role="auditor">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <button className="btn-secondary">
              <FaDownload /> Export All
            </button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="report-templates">
          {reportTemplates.map((template, index) => (
            <div key={index} className={`template-card ${template.color}`} onClick={() => handleGenerateReport(template)}>
              <div className="template-icon">{template.icon}</div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
              <button className="template-btn"><FaPlus /> Create</button>
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
                  <td><FaCalendarAlt /> {report.generated}</td>
                  <td>{report.dueDate || '-'}</td>
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
                    <button className="icon-btn" onClick={() => handlePreview(report)} title="Preview">
                      <FaEye />
                    </button>
                    <button className="icon-btn" onClick={(e) => handleDownload(report, e)} title="Download">
                      <FaDownload />
                    </button>
                    <button className="icon-btn" onClick={(e) => handlePrint(report, e)} title="Print">
                      <FaPrint />
                    </button>
                    <button className="icon-btn" onClick={(e) => handleShare(report, e)} title="Share">
                      <FaShare />
                    </button>
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
              <div className="modal-header">
                <h3><FaEye /> {selectedReport.name}</h3>
                <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
              </div>
              
              <div className="modal-body">
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
                        <li><span className="critical-dot"></span> Critical: SQL Injection vulnerability in web application</li>
                        <li><span className="high-dot"></span> High: Weak password policy not enforced</li>
                        <li><span className="medium-dot"></span> Medium: Missing security headers</li>
                        <li><span className="low-dot"></span> Low: Outdated software versions</li>
                      </ul>
                    </div>

                    <div className="preview-recommendations">
                      <h4>Recommendations</h4>
                      <ul>
                        <li>Implement parameterized queries to prevent SQL injection</li>
                        <li>Enforce strong password policy with MFA</li>
                        <li>Add security headers: CSP, HSTS, X-Frame-Options</li>
                        <li>Update all software to latest versions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
                <button className="btn-primary" onClick={(e) => handleDownload(selectedReport, e)}>
                  <FaDownload /> Download PDF
                </button>
                <button className="btn-primary" onClick={(e) => handlePrint(selectedReport, e)}>
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditorReports;