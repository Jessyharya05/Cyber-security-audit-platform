// src/components/auditor/AuditorChecklist.js
import React, { useState, useEffect } from 'react';
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
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditor.css';

const AuditorChecklist = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFunction, setFilterFunction] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [modalData, setModalData] = useState({ show: false, title: '', items: [] });

  // NIST CSF Functions
  const nistFunctions = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil semua companies yang diaudit oleh auditor ini
      const auditsRes = await api.get('/audit/');
      const myAudits = auditsRes.data?.filter(a => a.auditorId === user?.id) || [];
      const companyIds = [...new Set(myAudits.map(a => a.companyId))];
      
      // 2. Ambil detail companies
      const companiesPromises = companyIds.map(id => api.get(`/companies/${id}`));
      const companiesRes = await Promise.all(companiesPromises);
      const companiesData = companiesRes.map(res => res.data);
      setCompanies(companiesData);
      
      if (companiesData.length > 0) {
        setSelectedCompany(companiesData[0].id);
      }

      // 3. Ambil checklist items (nanti dari module audit)
      // Untuk sementara pake mock data
      setChecklistItems([
        {
          id: 1,
          control: 'Asset Management (ID.AM-1)',
          description: 'Physical devices and systems within the organization are inventoried',
          function: 'Identify',
          companyId: companiesData[0]?.id,
          status: 'compliant',
          evidence: 'uploaded',
          lastUpdated: '2024-02-20'
        },
        // ... tambahkan mock items lainnya
      ]);

    } catch (error) {
      console.error('Error fetching checklist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = checklistItems.filter(item => {
    const matchesSearch = item.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFunction = filterFunction === 'all' || item.function === filterFunction;
    const matchesCompany = item.companyId === selectedCompany;
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

  const updateStatus = async (id, newStatus) => {
    try {
      // Update ke database
      await api.put(`/checklist/${id}`, { status: newStatus });
      
      setChecklistItems(items =>
        items.map(item =>
          item.id === id ? { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : item
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="auditor">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading checklist...</p>
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
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(Number(e.target.value))}>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        {/* NIST Functions Overview */}
        <div className="nist-functions-overview">
          {nistFunctions.map(func => {
            const total = checklistItems.filter(i => i.function === func && i.companyId === selectedCompany).length;
            const compliant = checklistItems.filter(i => i.function === func && i.companyId === selectedCompany && i.status === 'compliant').length;
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
                {checklistItems.filter(i => i.companyId === selectedCompany && i.status === 'compliant').length}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Partially</span>
              <span className="stat-value">
                {checklistItems.filter(i => i.companyId === selectedCompany && i.status === 'partially').length}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Non-Compliant</span>
              <span className="stat-value">
                {checklistItems.filter(i => i.companyId === selectedCompany && i.status === 'non-compliant').length}
              </span>
            </div>
            <div className="summary-stat total">
              <span className="stat-label">Compliance Rate</span>
              <span className="stat-value">
                {Math.round((checklistItems.filter(i => i.companyId === selectedCompany && i.status === 'compliant').length / 
                  (checklistItems.filter(i => i.companyId === selectedCompany).length || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorChecklist;