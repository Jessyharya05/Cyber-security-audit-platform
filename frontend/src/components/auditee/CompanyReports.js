// src/components/auditee/CompanyReports.js
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
  FaChartBar,
  FaShieldAlt,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditee.css';

const CompanyReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [assets, setAssets] = useState([]);
  const [findings, setFindings] = useState([]);
  const [evidence, setEvidence] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const companyId = user?.companyId || 1;
      
      // Fetch all necessary data
      const [assetsRes, findingsRes, evidenceRes] = await Promise.all([
        api.get(`/assets/company/${companyId}`).catch(() => ({ data: [] })),
        api.get(`/findings/company/${companyId}`).catch(() => ({ data: [] })),
        api.get(`/evidence/company/${companyId}`).catch(() => ({ data: [] }))
      ]);

      setAssets(assetsRes.data || []);
      setFindings(findingsRes.data || []);
      setEvidence(evidenceRes.data || []);

      // Generate reports from data
      const generatedReports = generateReports(assetsRes.data || [], findingsRes.data || [], evidenceRes.data || []);
      setReports(generatedReports);

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReports = (assets, findings, evidence) => {
    const reports = [];
    const now = new Date();

    // Compliance Report
    const totalFindings = findings.length;
    const openFindings = findings.filter(f => f.status === 'open').length;
    const complianceScore = Math.round(((totalFindings - openFindings) / (totalFindings || 1)) * 100);

    reports.push({
      id: 1,
      name: `Company Compliance Report - ${now.toLocaleDateString()}`,
      type: 'Compliance',
      generated: now.toISOString().split('T')[0],
      format: 'PDF',
      size: '1.8 MB',
      description: 'Overall compliance status and NIST CSF scores',
      compliance: complianceScore,
      findings: totalFindings,
      openFindings: openFindings
    });

    // Asset Inventory Report
    reports.push({
      id: 2,
      name: `Asset Inventory Summary - ${now.toLocaleDateString()}`,
      type: 'Asset',
      generated: now.toISOString().split('T')[0],
      format: 'PDF',
      size: '1.2 MB',
      description: 'Complete list of all registered assets with CIA ratings',
      assets: assets.length,
      critical: assets.filter(a => a.cia === 'Critical').length,
      high: assets.filter(a => a.cia === 'High').length
    });

    // Findings Report
    if (findings.length > 0) {
      reports.push({
        id: 3,
        name: `Findings Report - ${now.toLocaleDateString()}`,
        type: 'Findings',
        generated: now.toISOString().split('T')[0],
        format: 'Excel',
        size: '2.1 MB',
        description: 'Detailed findings and remediation status',
        openFindings: findings.filter(f => f.status === 'open').length,
        closedFindings: findings.filter(f => f.status === 'closed').length,
        criticalFindings: findings.filter(f => f.severity === 'critical').length
      });
    }

    // Evidence Status Report
    if (evidence.length > 0) {
      reports.push({
        id: 4,
        name: `Evidence Status Report - ${now.toLocaleDateString()}`,
        type: 'Evidence',
        generated: now.toISOString().split('T')[0],
        format: 'PDF',
        size: '0.9 MB',
        description: 'Status of all required evidence',
        pending: evidence.filter(e => e.status === 'pending').length,
        uploaded: evidence.filter(e => e.status === 'uploaded').length,
        overdue: evidence.filter(e => e.status === 'overdue').length
      });
    }

    // Audit Summary (if applicable)
    if (findings.length > 0 || assets.length > 0) {
      reports.push({
        id: 5,
        name: `Security Audit Summary - ${now.toLocaleDateString()}`,
        type: 'Audit',
        generated: now.toISOString().split('T')[0],
        format: 'PDF',
        size: '2.4 MB',
        description: 'Complete audit results and recommendations',
        score: complianceScore,
        findings: totalFindings,
        assets: assets.length
      });
    }

    return reports;
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (report, e) => {
    e.stopPropagation();
    try {
      // Generate report content based on data
      let content = generateReportContent(report);
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/[^a-z0-9]/gi, '_')}.${report.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const generateReportContent = (report) => {
    switch(report.type) {
      case 'Compliance':
        return `COMPANY COMPLIANCE REPORT
===========================
Generated: ${report.generated}

OVERALL COMPLIANCE: ${report.compliance}%
Total Findings: ${report.findings}
Open Findings: ${report.openFindings}

ASSET SUMMARY
------------
Total Assets: ${assets.length}
Critical Assets: ${assets.filter(a => a.cia === 'Critical').length}
High Value Assets: ${assets.filter(a => a.cia === 'High').length}

FINDINGS BY SEVERITY
-------------------
Critical: ${findings.filter(f => f.severity === 'critical').length}
High: ${findings.filter(f => f.severity === 'high').length}
Medium: ${findings.filter(f => f.severity === 'medium').length}
Low: ${findings.filter(f => f.severity === 'low').length}

EVIDENCE STATUS
--------------
Uploaded: ${evidence.filter(e => e.status === 'uploaded').length}
Pending: ${evidence.filter(e => e.status === 'pending').length}
Overdue: ${evidence.filter(e => e.status === 'overdue').length}

Generated by CyberGuard GRC Platform`;
      
      default:
        return `${report.name}\nGenerated: ${report.generated}\n\n${report.description}`;
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="auditee">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <div className="stat-icon blue"><FaFileAlt /></div>
            <div className="stat-content">
              <h3>{reports.length}</h3>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><FaShieldAlt /></div>
            <div className="stat-content">
              <h3>{Math.round(((findings.length - findings.filter(f => f.status === 'open').length) / (findings.length || 1)) * 100)}%</h3>
              <p>Compliance Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{findings.filter(f => f.status === 'open').length}</h3>
              <p>Open Findings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><FaCalendarAlt /></div>
            <div className="stat-content">
              <h3>{new Date().toLocaleDateString()}</h3>
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
                <button className="icon-btn" onClick={(e) => handleDownload(report, e)}>
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
              <div className="modal-header">
                <h3><FaEye /> Report Preview</h3>
                <button className="close-btn" onClick={() => setShowPreview(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
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

                    <div className="preview-data">
                      <h4>Report Data</h4>
                      <pre>
                        {JSON.stringify({
                          assets: assets.length,
                          findings: findings.length,
                          evidence: evidence.length,
                          compliance: selectedReport.compliance
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowPreview(false)}>
                  Close
                </button>
                <button className="btn-primary" onClick={(e) => handleDownload(selectedReport, e)}>
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