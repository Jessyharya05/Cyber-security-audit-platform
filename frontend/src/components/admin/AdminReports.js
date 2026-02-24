// src/components/admin/AdminReports.js
// INI KHUSUS UNTUK LAPORAN-LAPORAN

import React, { useState } from 'react';
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
  FaShare
} from 'react-icons/fa';
import './Admin.css';

const AdminReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Monthly Compliance Report - February 2024',
      type: 'Compliance',
      generated: '2024-02-23',
      format: 'PDF',
      size: '2.4 MB',
      status: 'ready'
    },
    {
      id: 2,
      name: 'Audit Summary - Tech Corp',
      type: 'Audit',
      generated: '2024-02-22',
      format: 'PDF',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: 3,
      name: 'Risk Assessment Report - Q1 2024',
      type: 'Risk',
      generated: '2024-02-20',
      format: 'Excel',
      size: '3.2 MB',
      status: 'ready'
    },
    {
      id: 4,
      name: 'Auditor Performance - January 2024',
      type: 'Performance',
      generated: '2024-02-01',
      format: 'Excel',
      size: '2.1 MB',
      status: 'archived'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaFileAlt /> Reports & Analytics</h2>
            <p>Generate and download audit reports</p>
          </div>
          <button className="btn-primary"><FaFileAlt /> Generate Report</button>
        </div>

        {/* Report Cards - Quick Generate */}
        <div className="report-cards">
          <div className="report-card">
            <FaChartBar className="card-icon blue" />
            <h4>Compliance Report</h4>
            <p>Overall compliance status</p>
          </div>
          <div className="report-card">
            <FaFileAlt className="card-icon green" />
            <h4>Audit Summary</h4>
            <p>Detailed audit results</p>
          </div>
          <div className="report-card">
            <FaChartLine className="card-icon orange" />
            <h4>Risk Assessment</h4>
            <p>Vulnerability analysis</p>
          </div>
          <div className="report-card">
            <FaChartPie className="card-icon purple" />
            <h4>Trend Analysis</h4>
            <p>Compliance trends</p>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* Reports Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Format</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td><strong>{report.name}</strong></td>
                  <td>{report.type}</td>
                  <td><FaCalendarAlt /> {report.generated}</td>
                  <td>
                    {report.format === 'PDF' ? 
                      <FaFilePdf className="pdf-icon" /> : 
                      <FaFileExcel className="excel-icon" />}
                    {report.format}
                  </td>
                  <td>{report.size}</td>
                  <td>
                    <button className="icon-btn"><FaEye /></button>
                    <button className="icon-btn"><FaDownload /></button>
                    <button className="icon-btn"><FaPrint /></button>
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

export default AdminReports;