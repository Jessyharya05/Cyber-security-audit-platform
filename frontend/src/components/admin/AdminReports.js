// ============================================
// src/components/admin/AdminReports.js
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaFileAlt, 
  FaSearch, 
  FaDownload, 
  FaEye,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaCalendarAlt,
  FaFilter,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaShare,
  FaTimes,
  FaSyncAlt,
  FaBuilding,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCrown,
  FaUserTie,
  FaShieldAlt,
  FaFileExport,
  FaFileCsv
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Admin.css';

const AdminReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [reports, setReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [audits, setAudits] = useState([]);
  const [findings, setFindings] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeChart, setActiveChart] = useState('compliance');
  
  const [reportData, setReportData] = useState({
    type: 'compliance',
    format: 'PDF',
    dateRange: 'month',
    companyId: 'all',
    includeCharts: true,
    includeFindings: true,
    includeRecommendations: true
  });

  const [reportsList, setReportsList] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    readyReports: 0,
    archivedReports: 0,
    totalDownloads: 0,
    pdfReports: 0,
    excelReports: 0
  });

  useEffect(() => {
    fetchData();
    fetchReports();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data yang diperlukan untuk laporan
      const [companiesRes, auditsRes, findingsRes, usersRes] = await Promise.all([
        api.get('/companies/'),
        api.get('/audit/'),
        api.get('/findings/'),
        api.get('/users/')
      ]);

      setCompanies(companiesRes.data || []);
      setAudits(auditsRes.data || []);
      setFindings(findingsRes.data || []);
      setUsers(usersRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      // Ambil daftar report yang sudah digenerate (nanti dari backend)
      // Untuk sementara kita generate dari data yang ada
      const generatedReports = generateReportsFromData();
      setReportsList(generatedReports);
      
      // Hitung stats
      setStats({
        totalReports: generatedReports.length,
        readyReports: generatedReports.filter(r => r.status === 'ready').length,
        archivedReports: generatedReports.filter(r => r.status === 'archived').length,
        totalDownloads: generatedReports.reduce((sum, r) => sum + (r.downloads || 0), 0),
        pdfReports: generatedReports.filter(r => r.format === 'PDF').length,
        excelReports: generatedReports.filter(r => r.format === 'Excel').length
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Generate reports dari data yang ada
  const generateReportsFromData = () => {
    const reports = [];
    const now = new Date();

    // Compliance Report - per bulan
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      reports.push({
        id: `comp-${i}`,
        name: `Monthly Compliance Report - ${monthName} ${year}`,
        type: 'Compliance',
        generated: date.toISOString().split('T')[0],
        format: i % 2 === 0 ? 'PDF' : 'Excel',
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        status: i === 0 ? 'ready' : 'archived',
        company: 'All Companies',
        downloads: Math.floor(Math.random() * 20),
        chart: 'compliance',
        data: {
          companies: companies.length,
          avgCompliance: Math.round(companies.reduce((sum, c) => sum + (c.compliance || 70), 0) / (companies.length || 1)),
          totalFindings: findings.length,
          criticalFindings: findings.filter(f => f.severity === 'critical').length
        }
      });
    }

    // Audit Reports per company
    companies.slice(0, 5).forEach((company, idx) => {
      const companyAudits = audits.filter(a => a.companyId === company.id);
      if (companyAudits.length > 0) {
        reports.push({
          id: `audit-${company.id}`,
          name: `Audit Summary - ${company.name}`,
          type: 'Audit',
          generated: new Date().toISOString().split('T')[0],
          format: 'PDF',
          size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
          status: 'ready',
          company: company.name,
          downloads: Math.floor(Math.random() * 10),
          chart: 'audit',
          data: {
            totalAudits: companyAudits.length,
            completedAudits: companyAudits.filter(a => a.status === 'completed').length,
            findings: findings.filter(f => f.company_id === company.id).length,
            compliance: company.compliance || 70
          }
        });
      }
    });

    // Findings Reports
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    if (criticalCount > 0) {
      reports.push({
        id: 'findings-critical',
        name: 'Critical Findings Report',
        type: 'Findings',
        generated: new Date().toISOString().split('T')[0],
        format: 'PDF',
        size: '1.8 MB',
        status: 'ready',
        company: 'All Companies',
        downloads: Math.floor(Math.random() * 25),
        chart: 'findings',
        data: {
          critical: criticalCount,
          high: findings.filter(f => f.severity === 'high').length,
          medium: findings.filter(f => f.severity === 'medium').length,
          low: findings.filter(f => f.severity === 'low').length
        }
      });
    }

    // Risk Assessment
    reports.push({
      id: 'risk-q1',
      name: `Risk Assessment Report - Q1 ${new Date().getFullYear()}`,
      type: 'Risk',
      generated: new Date().toISOString().split('T')[0],
      format: 'Excel',
      size: '3.5 MB',
      status: 'ready',
      company: 'All Companies',
      downloads: Math.floor(Math.random() * 15),
      chart: 'risk',
      data: {
        highRisk: Math.floor(companies.length * 0.3),
        mediumRisk: Math.floor(companies.length * 0.5),
        lowRisk: Math.floor(companies.length * 0.2)
      }
    });

    // Auditor Performance
    const auditors = users.filter(u => u.role === 'auditor');
    if (auditors.length > 0) {
      reports.push({
        id: 'performance',
        name: `Auditor Performance - ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
        type: 'Performance',
        generated: new Date().toISOString().split('T')[0],
        format: 'Excel',
        size: '2.2 MB',
        status: 'ready',
        company: 'Internal',
        downloads: Math.floor(Math.random() * 8),
        chart: 'performance',
        data: auditors.map(a => ({
          name: a.name,
          completed: audits.filter(ad => ad.auditorId === a.id && ad.status === 'completed').length,
          rating: a.rating || 4.5
        }))
      });
    }

    return reports.sort((a, b) => new Date(b.generated) - new Date(a.generated));
  };

  // Filter reports
  const filteredReports = reportsList.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === 'all' || r.type.toLowerCase() === filterType.toLowerCase();
    
    // Filter by date range
    let matchDate = true;
    if (dateRange !== 'all') {
      const reportDate = new Date(r.generated);
      const now = new Date();
      const daysDiff = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
      
      switch(dateRange) {
        case 'week': matchDate = daysDiff <= 7; break;
        case 'month': matchDate = daysDiff <= 30; break;
        case 'quarter': matchDate = daysDiff <= 90; break;
        case 'year': matchDate = daysDiff <= 365; break;
        default: matchDate = true;
      }
    }
    
    return matchSearch && matchFilter && matchDate;
  });

  // ========== FUNGSI GENERATE REPORT ==========
  const handleGenerateReport = () => {
    setShowGenerateModal(true);
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    
    const newReport = {
      id: `gen-${Date.now()}`,
      name: `${reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1),
      generated: new Date().toISOString().split('T')[0],
      format: reportData.format,
      size: '1.5 MB',
      status: 'ready',
      company: reportData.companyId === 'all' ? 'All Companies' : companies.find(c => c.id === parseInt(reportData.companyId))?.name,
      downloads: 0,
      chart: reportData.type,
      data: generateReportData(reportData)
    };
    
    setReportsList([newReport, ...reportsList]);
    setShowGenerateModal(false);
    alert(`✅ Report generated successfully!`);
  };

  const generateReportData = (config) => {
    switch(config.type) {
      case 'compliance':
        return {
          companies: companies.length,
          avgCompliance: Math.round(companies.reduce((sum, c) => sum + (c.compliance || 70), 0) / (companies.length || 1)),
          totalFindings: findings.length,
          criticalFindings: findings.filter(f => f.severity === 'critical').length
        };
      case 'audit':
        return {
          totalAudits: audits.length,
          completedAudits: audits.filter(a => a.status === 'completed').length,
          inProgress: audits.filter(a => a.status === 'in-progress').length
        };
      case 'findings':
        return {
          critical: findings.filter(f => f.severity === 'critical').length,
          high: findings.filter(f => f.severity === 'high').length,
          medium: findings.filter(f => f.severity === 'medium').length,
          low: findings.filter(f => f.severity === 'low').length
        };
      default:
        return {};
    }
  };

  // ========== FUNGSI DOWNLOAD ==========
  const handleDownload = (report, e) => {
    e.stopPropagation();
    
    // Generate file content based on report data
    let content = '';
    if (report.format === 'PDF') {
      content = generatePDFContent(report);
    } else {
      content = generateExcelContent(report);
    }
    
    // Create download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/[^a-z0-9]/gi, '_')}.${report.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Update download count
    setReportsList(reportsList.map(r => 
      r.id === report.id ? {...r, downloads: (r.downloads || 0) + 1} : r
    ));
  };

  const generatePDFContent = (report) => {
    return `CYBERGUARD SECURITY AUDIT REPORT
================================
Report: ${report.name}
Generated: ${report.generated}
Company: ${report.company}
Format: PDF

EXECUTIVE SUMMARY
-----------------
This report provides a comprehensive overview of the security posture.

KEY METRICS
-----------
Total Companies: ${companies.length}
Total Audits: ${audits.length}
Total Findings: ${findings.length}
Critical Findings: ${findings.filter(f => f.severity === 'critical').length}
High Findings: ${findings.filter(f => f.severity === 'high').length}
Medium Findings: ${findings.filter(f => f.severity === 'medium').length}
Low Findings: ${findings.filter(f => f.severity === 'low').length}

DETAILS
-------
${JSON.stringify(report.data, null, 2)}

Generated by CyberGuard GRC Platform
`;
  };

  const generateExcelContent = (report) => {
    return `Report Name,${report.name}
Generated,${report.generated}
Company,${report.company}
Format,Excel

Type,Count
${Object.entries(report.data || {}).map(([key, val]) => `${key},${val}`).join('\n')}

Generated by CyberGuard GRC Platform`;
  };

  // ========== FUNGSI PREVIEW ==========
  const handlePreview = (report) => {
    setSelectedReport(report);
    setActiveChart(report.chart || 'compliance');
    setShowPreview(true);
  };

  // ========== FUNGSI PRINT ==========
  const handlePrint = (report, e) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${report.name}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #2563eb; }
            .report-header { border-bottom: 2px solid #333; margin-bottom: 20px; }
            .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin: 20px 0; }
            .stat-box { background: #f3f4f6; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>CYBERGUARD</h1>
            <h2>${report.name}</h2>
            <p>Generated: ${report.generated} | Company: ${report.company}</p>
          </div>
          <div class="stats">
            <div class="stat-box">Companies: ${companies.length}</div>
            <div class="stat-box">Audits: ${audits.length}</div>
            <div class="stat-box">Findings: ${findings.length}</div>
            <div class="stat-box">Critical: ${findings.filter(f => f.severity === 'critical').length}</div>
          </div>
          <pre>${JSON.stringify(report.data, null, 2)}</pre>
          <p>Generated by CyberGuard GRC Platform</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ========== FUNGSI SHARE ==========
  const handleShare = (report, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/reports/${report.id}`);
    alert('🔗 Report link copied to clipboard!');
  };

  // ========== FUNGSI DELETE ==========
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this report?')) {
      setReportsList(reportsList.filter(r => r.id !== id));
    }
  };

  // ========== FUNGSI REFRESH ==========
  const handleRefresh = () => {
    fetchData();
    fetchReports();
  };

  // ========== FUNGSI EXPORT ALL ==========
  const handleExportAll = () => {
    const csv = reportsList.map(r => 
      `${r.name},${r.type},${r.company},${r.generated},${r.format},${r.size},${r.downloads}`
    ).join('\n');
    
    const blob = new Blob([`Name,Type,Company,Generated,Format,Size,Downloads\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ========== GET FORMAT ICON ==========
  const getFormatIcon = (format) => {
    switch(format) {
      case 'PDF': return <FaFilePdf className="pdf-icon" />;
      case 'Excel': return <FaFileExcel className="excel-icon" />;
      default: return <FaFileAlt />;
    }
  };

  // ========== RENDER CHART ==========
  const renderChart = () => {
    const data = selectedReport?.data || {};
    
    switch(activeChart) {
      case 'compliance':
        return (
          <div className="chart-container">
            <h4>Compliance Overview</h4>
            <div className="bar-chart">
              {companies.slice(0, 5).map(c => (
                <div key={c.id} className="bar-item">
                  <div className="bar-label">{c.name}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{
                        width: `${c.compliance || 70}%`,
                        background: (c.compliance || 70) > 75 ? '#10b981' : (c.compliance || 70) > 50 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                    <span className="bar-value">{c.compliance || 70}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'findings':
        return (
          <div className="chart-container">
            <h4>Findings by Severity</h4>
            <div className="pie-chart-placeholder">
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="color-dot critical"></span>
                  <span>Critical: {findings.filter(f => f.severity === 'critical').length}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot high"></span>
                  <span>High: {findings.filter(f => f.severity === 'high').length}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot medium"></span>
                  <span>Medium: {findings.filter(f => f.severity === 'medium').length}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot low"></span>
                  <span>Low: {findings.filter(f => f.severity === 'low').length}</span>
                </div>
              </div>
              <div className="pie-stats">
                <div className="stat-circle">
                  <h3>{findings.length}</h3>
                  <p>Total Findings</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="chart-container">
            <h4>Report Data</h4>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        );
    }
  };

  // ========== MODAL GENERATE REPORT ==========
  const GenerateModal = () => {
    if (!showGenerateModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaFileAlt /> Generate New Report</h3>
            <button className="close-btn" onClick={() => setShowGenerateModal(false)}>×</button>
          </div>
          <form onSubmit={handleGenerateSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label>Report Type</label>
                <select 
                  value={reportData.type}
                  onChange={(e) => setReportData({...reportData, type: e.target.value})}
                >
                  <option value="compliance">📊 Compliance Report</option>
                  <option value="audit">📋 Audit Summary</option>
                  <option value="risk">⚠️ Risk Assessment</option>
                  <option value="findings">🔍 Findings Report</option>
                  <option value="performance">📈 Auditor Performance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Format</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="PDF" 
                      checked={reportData.format === 'PDF'}
                      onChange={(e) => setReportData({...reportData, format: e.target.value})}
                    />
                    <FaFilePdf /> PDF
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="Excel" 
                      checked={reportData.format === 'Excel'}
                      onChange={(e) => setReportData({...reportData, format: e.target.value})}
                    />
                    <FaFileExcel /> Excel
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Period</label>
                <select 
                  value={reportData.dateRange}
                  onChange={(e) => setReportData({...reportData, dateRange: e.target.value})}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>
              </div>

              <div className="form-group">
                <label>Company</label>
                <select 
                  value={reportData.companyId}
                  onChange={(e) => setReportData({...reportData, companyId: e.target.value})}
                >
                  <option value="all">🏢 All Companies</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Include</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={reportData.includeCharts}
                      onChange={(e) => setReportData({...reportData, includeCharts: e.target.checked})}
                    />
                    📊 Charts & Visualizations
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={reportData.includeFindings}
                      onChange={(e) => setReportData({...reportData, includeFindings: e.target.checked})}
                    />
                    🔍 Detailed Findings
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={reportData.includeRecommendations}
                      onChange={(e) => setReportData({...reportData, includeRecommendations: e.target.checked})}
                    />
                    💡 Recommendations
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowGenerateModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Generate Report</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ========== MODAL PREVIEW ==========
  const PreviewModal = () => {
    if (!showPreview || !selectedReport) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowPreview(false)}>
        <div className="modal-content xlarge" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaEye /> Report Preview: {selectedReport.name}</h3>
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="report-preview">
              {/* Header */}
              <div className="preview-header">
                <div className="header-left">
                  <FaShieldAlt className="logo-icon" />
                  <div>
                    <h1>CYBERGUARD</h1>
                    <p>Security Audit Platform · NIST CSF 2.0</p>
                  </div>
                </div>
                <div className="header-right">
                  <p>Generated: {selectedReport.generated}</p>
                  <p>Report ID: {selectedReport.id}</p>
                </div>
              </div>

              {/* Title */}
              <div className="preview-title">
                <h2>{selectedReport.name}</h2>
                <p>Company: {selectedReport.company}</p>
              </div>

              {/* Stats Grid */}
              <div className="preview-stats">
                <div className="stat-box">
                  <FaBuilding />
                  <div>
                    <h4>Companies</h4>
                    <p>{companies.length}</p>
                  </div>
                </div>
                <div className="stat-box">
                  <FaUsers />
                  <div>
                    <h4>Users</h4>
                    <p>{users.length}</p>
                  </div>
                </div>
                <div className="stat-box">
                  <FaExclamationTriangle className="critical" />
                  <div>
                    <h4>Critical Findings</h4>
                    <p>{findings.filter(f => f.severity === 'critical').length}</p>
                  </div>
                </div>
                <div className="stat-box">
                  <FaCheckCircle className="good" />
                  <div>
                    <h4>Compliance</h4>
                    <p>{Math.round(companies.reduce((sum, c) => sum + (c.compliance || 70), 0) / (companies.length || 1))}%</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="preview-chart">
                {renderChart()}
              </div>

              {/* Report Data */}
              <div className="preview-section">
                <h3>📊 Report Data</h3>
                <pre className="report-data">{JSON.stringify(selectedReport.data, null, 2)}</pre>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
            <button className="btn-primary" onClick={(e) => handleDownload(selectedReport, e)}>
              <FaDownload /> Download {selectedReport.format}
            </button>
            <button className="btn-primary" onClick={(e) => handlePrint(selectedReport, e)}>
              <FaPrint /> Print
            </button>
            <button className="btn-primary" onClick={(e) => handleShare(selectedReport, e)}>
              <FaShare /> Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaFileAlt /> Reports & Analytics</h2>
            <p>Generate, view and download audit reports</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleRefresh}>
              <FaSyncAlt /> Refresh
            </button>
            <button className="btn-secondary" onClick={handleExportAll}>
              <FaFileExport /> Export List
            </button>
            <button className="btn-primary" onClick={handleGenerateReport}>
              <FaFileAlt /> Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><FaFileAlt /></div>
            <h3>{stats.totalReports}</h3>
            <p>Total Reports</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><FaCheckCircle /></div>
            <h3>{stats.readyReports}</h3>
            <p>Ready Reports</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><FaDownload /></div>
            <h3>{stats.totalDownloads}</h3>
            <p>Total Downloads</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><FaFilePdf /></div>
            <h3>{stats.pdfReports}</h3>
            <p>PDF Reports</p>
          </div>
        </div>

        {/* Quick Generate Cards */}
        <div className="report-cards">
          <div className="report-card" onClick={() => {
            setReportData({...reportData, type: 'compliance', format: 'PDF'});
            setShowGenerateModal(true);
          }}>
            <FaChartBar className="card-icon blue" />
            <h4>Compliance Report</h4>
            <p>Overall compliance status across all companies</p>
          </div>
          <div className="report-card" onClick={() => {
            setReportData({...reportData, type: 'audit', format: 'PDF'});
            setShowGenerateModal(true);
          }}>
            <FaFileAlt className="card-icon green" />
            <h4>Audit Summary</h4>
            <p>Detailed audit results and findings</p>
          </div>
          <div className="report-card" onClick={() => {
            setReportData({...reportData, type: 'findings', format: 'PDF'});
            setShowGenerateModal(true);
          }}>
            <FaExclamationTriangle className="card-icon red" />
            <h4>Findings Report</h4>
            <p>Critical and high severity findings</p>
          </div>
          <div className="report-card" onClick={() => {
            setReportData({...reportData, type: 'performance', format: 'Excel'});
            setShowGenerateModal(true);
          }}>
            <FaUserTie className="card-icon purple" />
            <h4>Auditor Performance</h4>
            <p>Auditor metrics and statistics</p>
          </div>
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
              <option value="compliance">Compliance</option>
              <option value="audit">Audit</option>
              <option value="findings">Findings</option>
              <option value="performance">Performance</option>
              <option value="risk">Risk</option>
            </select>
          </div>
          <div className="date-filter">
            <FaCalendarAlt className="filter-icon" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Company</th>
                <th>Generated</th>
                <th>Format</th>
                <th>Size</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="clickable-row" onClick={() => handlePreview(report)}>
                  <td><strong>{report.name}</strong></td>
                  <td><span className="type-badge">{report.type}</span></td>
                  <td>{report.company}</td>
                  <td><FaCalendarAlt /> {report.generated}</td>
                  <td>
                    {getFormatIcon(report.format)} {report.format}
                  </td>
                  <td>{report.size}</td>
                  <td>{report.downloads}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" onClick={(e) => handlePreview(report)} title="Preview">
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
                    <button className="icon-btn" onClick={(e) => handleDelete(report.id, e)} title="Delete">
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODALS */}
        <GenerateModal />
        <PreviewModal />
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;