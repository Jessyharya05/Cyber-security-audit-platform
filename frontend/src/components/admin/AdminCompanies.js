// src/components/admin/AdminCompanies.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaBuilding, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaDownload,
  FaFilter,
  FaChartBar,
  FaUsers,
  FaServer,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import './Admin.css';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: 'Tech Corp', 
      email: 'admin@techcorp.com',
      sector: 'Technology',
      employees: 150, 
      assets: 45, 
      status: 'active', 
      compliance: 82, 
      exposure: 'Medium',
      criticalFindings: 2,
      highFindings: 5,
      mediumFindings: 8,
      lastAudit: '2024-02-15',
      registrationDate: '2024-01-10'
    },
    { 
      id: 2, 
      name: 'Finance Ltd', 
      email: 'contact@finance.com',
      sector: 'Finance',
      employees: 80, 
      assets: 23, 
      status: 'active', 
      compliance: 64, 
      exposure: 'High',
      criticalFindings: 3,
      highFindings: 4,
      mediumFindings: 6,
      lastAudit: '2024-02-10',
      registrationDate: '2024-01-15'
    },
    { 
      id: 3, 
      name: 'HealthCare Inc', 
      email: 'info@healthcare.com',
      sector: 'Healthcare',
      employees: 200, 
      assets: 67, 
      status: 'warning', 
      compliance: 45, 
      exposure: 'High',
      criticalFindings: 5,
      highFindings: 7,
      mediumFindings: 9,
      lastAudit: '2024-02-01',
      registrationDate: '2024-01-05'
    },
    { 
      id: 4, 
      name: 'EduGlobal', 
      email: 'admin@eduglobal.com',
      sector: 'Education',
      employees: 45, 
      assets: 34, 
      status: 'active', 
      compliance: 91, 
      exposure: 'Low',
      criticalFindings: 0,
      highFindings: 1,
      mediumFindings: 3,
      lastAudit: '2024-02-20',
      registrationDate: '2024-01-20'
    },
    { 
      id: 5, 
      name: 'Retail Solutions', 
      email: 'support@retail.com',
      sector: 'Retail',
      employees: 120, 
      assets: 56, 
      status: 'inactive', 
      compliance: 38, 
      exposure: 'Medium',
      criticalFindings: 4,
      highFindings: 6,
      mediumFindings: 5,
      lastAudit: '2024-01-25',
      registrationDate: '2023-12-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || company.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowDetails(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaBuilding /> Companies Management</h2>
            <p>Manage all registered companies and monitor their compliance</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <FaPlus /> Add Company
            </button>
            <button className="btn-secondary">
              <FaDownload /> Export List
            </button>
          </div>
        </div>

        {/* Stats Cards KHUSUS COMPANIES */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>{companies.length}</h3>
              <p>Total Companies</p>
            </div>
            <div className="stat-trend">+2 this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{companies.filter(c => c.status === 'active').length}</h3>
              <p>Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{companies.reduce((sum, c) => sum + c.criticalFindings, 0)}</h3>
              <p>Critical Findings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3>{Math.round(companies.reduce((sum, c) => sum + c.compliance, 0) / companies.length)}%</h3>
              <p>Avg Compliance</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Companies Table - KHUSUS data company */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Employees</th>
                <th>Assets</th>
                <th>Compliance</th>
                <th>Findings</th>
                <th>Exposure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id}>
                  <td>
                    <strong>{company.name}</strong>
                    <div className="text-small">{company.email}</div>
                  </td>
                  <td>{company.sector}</td>
                  <td>{company.employees}</td>
                  <td>{company.assets}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${company.compliance}%`}}></div>
                      </div>
                      <span>{company.compliance}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="findings-stack">
                      <span className="critical-badge-small">{company.criticalFindings} C</span>
                      <span className="high-badge-small">{company.highFindings} H</span>
                      <span className="medium-badge-small">{company.mediumFindings} M</span>
                    </div>
                  </td>
                  <td>
                    <span className={`exposure-badge ${company.exposure.toLowerCase()}`}>
                      {company.exposure}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${company.status}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleViewDetails(company)}><FaEye /></button>
                    <button className="icon-btn"><FaEdit /></button>
                    <button className="icon-btn"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Company Details Modal - Fitur KHUSUS Companies */}
        {showDetails && selectedCompany && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3><FaBuilding /> {selectedCompany.name}</h3>
              
              <div className="company-details">
                <div className="detail-section">
                  <h4>Company Information</h4>
                  <div className="detail-grid">
                    <div><label>Email:</label> {selectedCompany.email}</div>
                    <div><label>Sector:</label> {selectedCompany.sector}</div>
                    <div><label>Employees:</label> {selectedCompany.employees}</div>
                    <div><label>Assets:</label> {selectedCompany.assets}</div>
                    <div><label>Registered:</label> {selectedCompany.registrationDate}</div>
                    <div><label>Last Audit:</label> {selectedCompany.lastAudit}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Security Overview</h4>
                  <div className="stats-mini-grid">
                    <div className="stat-mini">
                      <label>Compliance</label>
                      <div className="progress-circle">
                        <span>{selectedCompany.compliance}%</span>
                      </div>
                    </div>
                    <div className="stat-mini">
                      <label>Findings</label>
                      <div className="findings-summary">
                        <div><span className="critical-dot"></span> Critical: {selectedCompany.criticalFindings}</div>
                        <div><span className="high-dot"></span> High: {selectedCompany.highFindings}</div>
                        <div><span className="medium-dot"></span> Medium: {selectedCompany.mediumFindings}</div>
                      </div>
                    </div>
                    <div className="stat-mini">
                      <label>Exposure Level</label>
                      <span className={`exposure-badge large ${selectedCompany.exposure.toLowerCase()}`}>
                        {selectedCompany.exposure}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDetails(false)}>Close</button>
                <button className="btn-primary">Schedule Audit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCompanies;