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
  FaTrash,
  FaSave,
  FaBuilding,
  FaShieldAlt,
  FaTimes,
  FaSpinner,
  FaClock
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditor.css';

const nistFunctions = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

const AuditorChecklist = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFunction, setFilterFunction] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [error, setError] = useState(null);
  
  // State untuk modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    evidence: '',
    notes: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany !== null) {
      fetchChecklistItems(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/audit/my-companies');
      const data = res.data || [];
      console.log('✅ Companies fetched:', data);

      setCompanies(data);

      if (data.length > 0) {
        setSelectedCompany(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error fetching companies:', err);
      setError('Gagal memuat daftar company. Silakan refresh halaman.');
      setLoading(false);
    }
  };

  const fetchChecklistItems = async (companyId) => {
    setLoading(true);
    try {
      // 🔥 AMBIL DATA DARI DATABASE (nanti ganti dengan API real)
      const response = await api.get(`/checklist/company/${companyId}`).catch(() => null);
      
      if (response && response.data) {
        setChecklistItems(response.data);
      } else {
        // Fallback ke mock data
        const mockItems = [
          {
            id: 1,
            control: 'ID.AM-1',
            description: 'Physical devices and systems within the organization are inventoried',
            function: 'Identify',
            companyId: companyId,
            status: 'compliant',
            evidence: 'uploaded',
            lastUpdated: '2024-02-20',
          },
          {
            id: 2,
            control: 'PR.AC-1',
            description: 'Identities and credentials are managed for authorized devices, users and processes',
            function: 'Protect',
            companyId: companyId,
            status: 'partially',
            evidence: 'pending',
            lastUpdated: '2024-02-21',
          },
          {
            id: 3,
            control: 'DE.CM-1',
            description: 'The network is monitored to detect potential cybersecurity events',
            function: 'Detect',
            companyId: companyId,
            status: 'non-compliant',
            evidence: 'missing',
            lastUpdated: '2024-02-19',
          },
          {
            id: 4,
            control: 'RS.RP-1',
            description: 'Response plan is executed during or after an incident',
            function: 'Respond',
            companyId: companyId,
            status: 'compliant',
            evidence: 'uploaded',
            lastUpdated: '2024-02-18',
          },
          {
            id: 5,
            control: 'RC.RP-1',
            description: 'Recovery plan is executed during or after a cybersecurity incident',
            function: 'Recover',
            companyId: companyId,
            status: 'partially',
            evidence: 'pending',
            lastUpdated: '2024-02-17',
          },
        ];
        setChecklistItems(mockItems);
      }
    } catch (err) {
      console.error('❌ Error fetching checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    const id = Number(e.target.value);
    setSelectedCompany(id);
  };

  // 🔥 UPDATE STATUS DARI SELECT (LANGSUNG KE DATABASE)
  const updateStatus = async (id, newStatus) => {
    try {
      // Panggil API update
      await api.put(`/checklist/${id}`, { 
        status: newStatus,
        evidence: checklistItems.find(i => i.id === id)?.evidence || 'pending'
      });
      
      // Update local state
      setChecklistItems((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
            : item
        )
      );
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('Gagal update status. Silakan coba lagi.');
    }
  };

  // ========== FUNGSI VIEW DETAIL ==========
  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // ========== FUNGSI EDIT (BENERAN) ==========
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditForm({
      status: item.status,
      evidence: item.evidence,
      notes: ''
    });
    setShowEditModal(true);
  };

  // ========== HANDLE EDIT SUBMIT ==========
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedItem) return;
    
    try {
      // Panggil API update
      await api.put(`/checklist/${selectedItem.id}`, {
        status: editForm.status,
        evidence: editForm.evidence,
        notes: editForm.notes
      });
      
      // Update local state
      setChecklistItems(items =>
        items.map(item =>
          item.id === selectedItem.id
            ? { 
                ...item, 
                status: editForm.status, 
                evidence: editForm.evidence,
                lastUpdated: new Date().toISOString().split('T')[0] 
              }
            : item
        )
      );
      
      setShowEditModal(false);
      alert('✅ Item updated successfully!');
    } catch (err) {
      console.error('❌ Error updating item:', err);
      alert('Gagal update item. Silakan coba lagi.');
    }
  };

  // ========== FUNGSI DELETE ==========
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this checklist item?')) {
      try {
        await api.delete(`/checklist/${id}`);
        setChecklistItems((items) => items.filter((item) => item.id !== id));
        alert('Item deleted successfully!');
      } catch (err) {
        console.error('❌ Error deleting item:', err);
        alert('Failed to delete item');
      }
    }
  };

  // ========== MODAL DETAIL ==========
  const DetailModal = () => {
    if (!showDetailModal || !selectedItem) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaEye /> Control Details</h3>
            <button className="close-btn" onClick={() => setShowDetailModal(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="detail-grid">
              <div className="detail-row">
                <label>Control ID:</label>
                <span>{selectedItem.control}</span>
              </div>
              <div className="detail-row">
                <label>Description:</label>
                <span>{selectedItem.description}</span>
              </div>
              <div className="detail-row">
                <label>Function:</label>
                <span className="function-badge">{selectedItem.function}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <div className="status-cell">
                  {getStatusIcon(selectedItem.status)}
                  <span>{selectedItem.status}</span>
                </div>
              </div>
              <div className="detail-row">
                <label>Evidence:</label>
                <span>{selectedItem.evidence}</span>
              </div>
              <div className="detail-row">
                <label>Last Updated:</label>
                <span>{selectedItem.lastUpdated}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
              Close
            </button>
            <button className="btn-primary" onClick={() => {
              setShowDetailModal(false);
              handleEdit(selectedItem);
            }}>
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ========== MODAL EDIT ==========
  const EditModal = () => {
    if (!showEditModal || !selectedItem) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaEdit /> Edit Checklist Item</h3>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label>Control ID</label>
                <input 
                  type="text" 
                  value={selectedItem.control} 
                  disabled 
                  className="readonly-field"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={selectedItem.description} 
                  disabled 
                  rows="2"
                  className="readonly-field"
                />
              </div>
              
              <div className="form-group">
                <label>Function</label>
                <input 
                  type="text" 
                  value={selectedItem.function} 
                  disabled 
                  className="readonly-field"
                />
              </div>
              
              <div className="form-group">
                <label>Status *</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  required
                >
                  <option value="compliant">Compliant</option>
                  <option value="partially">Partially Compliant</option>
                  <option value="non-compliant">Non-Compliant</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Evidence</label>
                <select 
                  value={editForm.evidence} 
                  onChange={(e) => setEditForm({...editForm, evidence: e.target.value})}
                >
                  <option value="uploaded">Uploaded</option>
                  <option value="pending">Pending</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Notes / Comments</label>
                <textarea 
                  value={editForm.notes} 
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows="3"
                  placeholder="Add any notes or comments about this control..."
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <FaEdit /> Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredItems = checklistItems.filter((item) => {
    const matchesSearch =
      item.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFunction = filterFunction === 'all' || item.function === filterFunction;
    const matchesCompany = item.companyId === selectedCompany;
    return matchesSearch && matchesFunction && matchesCompany;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <FaCheckCircle className="status-icon compliant" />;
      case 'partially': return <FaMinusCircle className="status-icon partially" />;
      case 'non-compliant': return <FaTimesCircle className="status-icon non-compliant" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  const getEvidenceBadge = (evidence) => {
    switch (evidence) {
      case 'uploaded': return <span className="evidence-badge good">Evidence Uploaded</span>;
      case 'pending': return <span className="evidence-badge warning">Pending</span>;
      case 'missing': return <span className="evidence-badge critical">Missing</span>;
      default: return <span className="evidence-badge">Not Started</span>;
    }
  };

  const getComplianceStats = () => {
    const filtered = checklistItems.filter((i) => i.companyId === selectedCompany);
    const compliant = filtered.filter((i) => i.status === 'compliant').length;
    const partially = filtered.filter((i) => i.status === 'partially').length;
    const nonCompliant = filtered.filter((i) => i.status === 'non-compliant').length;
    const rate = filtered.length > 0 ? Math.round((compliant / filtered.length) * 100) : 0;
    return { compliant, partially, nonCompliant, rate, total: filtered.length };
  };

  const stats = getComplianceStats();

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

  if (error) {
    return (
      <DashboardLayout role="auditor">
        <div className="error-container">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchCompanies} className="btn-secondary">Coba Lagi</button>
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
            <button className="btn-secondary" onClick={() => fetchChecklistItems(selectedCompany)}>
              <FaSave /> Refresh Data
            </button>
          </div>
        </div>

        {/* Company Selector */}
        <div className="company-selector">
          <label><FaBuilding /> Select Company:</label>
          {companies.length === 0 ? (
            <p style={{ color: '#999', marginLeft: 8 }}>
              Tidak ada company yang di-assign ke akun Anda.
            </p>
          ) : (
            <select value={selectedCompany ?? ''} onChange={handleCompanyChange}>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* NIST Functions Overview */}
        <div className="nist-functions-overview">
          {nistFunctions.map((func) => {
            const items = checklistItems.filter(
              (i) => i.function === func && i.companyId === selectedCompany
            );
            const compliant = items.filter((i) => i.status === 'compliant').length;
            const percentage = items.length > 0 ? Math.round((compliant / items.length) * 100) : 0;

            return (
              <div key={func} className="function-card">
                <h4>{func}</h4>
                <div className="function-stats">
                  <span className="function-percent">{percentage}%</span>
                  <span className="function-count">{compliant}/{items.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
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
              {nistFunctions.map((func) => (
                <option key={func} value={func}>{func}</option>
              ))}
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    {companies.length === 0
                      ? 'Tidak ada company yang di-assign.'
                      : 'Tidak ada checklist item ditemukan.'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.control}</strong></td>
                    <td>{item.description}</td>
                    <td><span className="function-badge">{item.function}</span></td>
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
                      <button 
                        className="icon-btn" 
                        onClick={() => handleViewDetail(item)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Compliance Summary */}
        <div className="compliance-summary">
          <h3>Overall Compliance</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Compliant</span>
              <span className="stat-value">{stats.compliant}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Partially</span>
              <span className="stat-value">{stats.partially}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Non-Compliant</span>
              <span className="stat-value">{stats.nonCompliant}</span>
            </div>
            <div className="summary-stat total">
              <span className="stat-label">Compliance Rate</span>
              <span className="stat-value">{stats.rate}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <DetailModal />
      <EditModal />
    </DashboardLayout>
  );
};

export default AuditorChecklist;