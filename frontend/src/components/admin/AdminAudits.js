// ============================================
// src/components/admin/AdminAudits.js (LANJUTAN)
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaClipboardList, FaSearch, FaPlus, FaEdit, FaTrash,
    FaEye, FaFilter, FaCalendarAlt, FaCheckCircle,
    FaClock, FaExclamationTriangle, FaUserTie,
    FaBuilding, FaChartBar, FaCalendarCheck,
    FaTimes
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const AdminAudits = () => {
    const [loading, setLoading] = useState(true);
    const [audits, setAudits] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [auditors, setAuditors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newAudit, setNewAudit] = useState({
        companyId: '',
        auditorId: '',
        scope: '',
        startDate: '',
        endDate: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Ambil semua audits
            const auditsRes = await api.get('/audit/');
            setAudits(auditsRes.data || []);
            
            // Ambil semua companies untuk dropdown
            const companiesRes = await api.get('/companies/');
            setCompanies(companiesRes.data || []);
            
            // Ambil semua auditors
            const auditorsRes = await api.get('/users/?role=auditor');
            setAuditors(auditorsRes.data || []);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hitung audits yang due this week
    const getDueThisWeek = () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return audits.filter(audit => {
            const dueDate = new Date(audit.dueDate || audit.endDate);
            return dueDate >= today && dueDate <= nextWeek;
        });
    };

    const dueThisWeek = getDueThisWeek();

    // Stats
    const stats = {
        total: audits.length,
        inProgress: audits.filter(a => a.status === 'in-progress').length,
        completed: audits.filter(a => a.status === 'completed').length,
        pending: audits.filter(a => a.status === 'pending').length,
        review: audits.filter(a => a.status === 'review').length,
        totalFindings: audits.reduce((sum, a) => sum + (a.findings || 0), 0),
        criticalFindings: audits.reduce((sum, a) => sum + (a.criticalFindings || 0), 0),
        dueThisWeek: dueThisWeek.length
    };

    // Filter
    const filteredAudits = audits.filter(a => {
        const companyName = companies.find(c => c.id === a.companyId)?.name || '';
        const auditorName = auditors.find(ad => ad.id === a.auditorId)?.name || '';
        
        const matchSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auditorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (a.scope || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterStatus === 'all' || a.status === filterStatus;
        return matchSearch && matchFilter;
    });

    // ========== FUNGSI KLIK STATS ==========
    const handleStatClick = async (type) => {
        try {
            let title = '';
            let items = [];
            
            switch(type) {
                case 'total':
                    title = 'All Audits';
                    items = audits;
                    break;
                case 'inProgress':
                    title = 'In Progress Audits';
                    items = audits.filter(a => a.status === 'in-progress');
                    break;
                case 'completed':
                    title = 'Completed Audits';
                    items = audits.filter(a => a.status === 'completed');
                    break;
                case 'pending':
                    title = 'Pending Audits';
                    items = audits.filter(a => a.status === 'pending');
                    break;
                case 'review':
                    title = 'Under Review Audits';
                    items = audits.filter(a => a.status === 'review');
                    break;
                case 'critical':
                    title = 'Audits with Critical Findings';
                    items = audits.filter(a => (a.criticalFindings || 0) > 0);
                    break;
                case 'totalFindings':
                    title = 'All Findings by Audit';
                    items = audits.map(a => ({
                        company: companies.find(c => c.id === a.companyId)?.name || 'Unknown',
                        findings: a.findings || 0,
                        critical: a.criticalFindings || 0,
                        status: a.status || 'pending'
                    }));
                    break;
                case 'dueThisWeek':
                    title = 'Audits Due This Week';
                    items = dueThisWeek.map(a => ({
                        company: companies.find(c => c.id === a.companyId)?.name || 'Unknown',
                        dueDate: a.dueDate || a.endDate,
                        auditor: auditors.find(ad => ad.id === a.auditorId)?.name || 'Unknown',
                        status: a.status,
                        progress: a.progress || 0
                    }));
                    break;
                default:
                    return;
            }
            
            setModalData({ show: true, title, items });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // ========== FUNGSI KLIK BARIS ==========
    const handleRowClick = (audit) => {
        setSelectedAudit(audit);
        setShowDetail(true);
    };

    // ========== FUNGSI DELETE ==========
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this audit?')) {
            try {
                await api.delete(`/audit/${id}`);
                fetchData();
                alert('Audit deleted successfully!');
            } catch (error) {
                console.error('Error deleting audit:', error);
                alert('Failed to delete audit');
            }
        }
    };

    // ========== FUNGSI EDIT ==========
    const handleEdit = (audit, e) => {
        e.stopPropagation();
        alert(`Edit audit for ${companies.find(c => c.id === audit.companyId)?.name} (Demo mode)`);
    };

    // ========== FUNGSI SCHEDULE ==========
    const handleSchedule = () => {
        setShowScheduleModal(true);
    };

    // ========== FUNGSI SCHEDULE SUBMIT ==========
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/audit/', newAudit);
            if (response.data) {
                fetchData();
                setShowScheduleModal(false);
                setNewAudit({
                    companyId: '',
                    auditorId: '',
                    scope: '',
                    startDate: '',
                    endDate: '',
                    priority: 'medium'
                });
                alert('Audit scheduled successfully!');
            }
        } catch (error) {
            console.error('Error scheduling audit:', error);
            alert('Failed to schedule audit');
        }
    };

    // ========== GET STATUS BADGE ==========
    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': return <span className="status-badge good"><FaCheckCircle /> Completed</span>;
            case 'in-progress': return <span className="status-badge warning"><FaClock /> In Progress</span>;
            case 'review': return <span className="status-badge purple"><FaEye /> Under Review</span>;
            case 'pending': return <span className="status-badge"><FaClock /> Pending</span>;
            default: return <span className="status-badge">{status}</span>;
        }
    };

    // ========== MODAL DETAIL AUDIT ==========
    const DetailModal = () => {
        if (!showDetail || !selectedAudit) return null;

        const company = companies.find(c => c.id === selectedAudit.companyId);
        const auditor = auditors.find(a => a.id === selectedAudit.auditorId);

        return (
            <div className="modal-overlay" onClick={() => setShowDetail(false)}>
                <div className="modal-content large" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaClipboardList /> Audit Details</h3>
                        <button className="close-btn" onClick={() => setShowDetail(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="audit-detail-grid">
                            <div className="detail-section">
                                <h4>Audit Information</h4>
                                <div className="detail-row">
                                    <label>Company:</label>
                                    <span className="detail-value">{company?.name || 'Unknown'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Auditor:</label>
                                    <span className="detail-value">{auditor?.name || 'Unknown'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Scope:</label>
                                    <span className="detail-value">{selectedAudit.scope || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Start Date:</label>
                                    <span className="detail-value">{selectedAudit.startDate || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>End Date:</label>
                                    <span className="detail-value">{selectedAudit.endDate || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Due Date:</label>
                                    <span className="detail-value">{selectedAudit.dueDate || selectedAudit.endDate || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Status:</label>
                                    <span className="detail-value">{getStatusBadge(selectedAudit.status)}</span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4>Progress & Findings</h4>
                                <div className="detail-row">
                                    <label>Progress:</label>
                                    <div className="progress-cell">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{width: `${selectedAudit.progress || 0}%`}}></div>
                                        </div>
                                        <span>{selectedAudit.progress || 0}%</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <label>Total Findings:</label>
                                    <span className="detail-value">{selectedAudit.findings || 0}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Critical Findings:</label>
                                    <span className="detail-value critical-text">{selectedAudit.criticalFindings || 0}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Priority:</label>
                                    <span className={`priority-badge ${selectedAudit.priority || 'medium'}`}>
                                        {selectedAudit.priority || 'medium'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setShowDetail(false)}>Close</button>
                        <button className="btn-primary" onClick={(e) => handleEdit(selectedAudit, e)}>
                            <FaEdit /> Edit
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ========== MODAL STATS ==========
    const StatsModal = () => {
        if (!modalData.show) return null;

        return (
            <div className="modal-overlay" onClick={() => setModalData({...modalData, show: false})}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>{modalData.title}</h3>
                        <button className="close-btn" onClick={() => setModalData({...modalData, show: false})}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modal-body">
                        {modalData.items.length === 0 ? (
                            <p className="no-data">No data available</p>
                        ) : (
                            <table className="detail-table">
                                <thead>
                                    <tr>
                                        {Object.keys(modalData.items[0]).map(key => (
                                            <th key={key}>{key.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map((item, idx) => (
                                        <tr key={idx} className={item.id ? 'clickable-row' : ''}>
                                            {Object.values(item).map((val, i) => (
                                                <td key={i}>
                                                    {typeof val === 'number' && i === Object.keys(item).length - 1 && val > 0 ? (
                                                        <span className="critical-badge-small">{val}</span>
                                                    ) : (
                                                        val?.toString() || '-'
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ========== MODAL SCHEDULE ==========
    const ScheduleModal = () => {
        if (!showScheduleModal) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaCalendarCheck /> Schedule New Audit</h3>
                        <button className="close-btn" onClick={() => setShowScheduleModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleScheduleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Company *</label>
                                <select 
                                    required 
                                    value={newAudit.companyId}
                                    onChange={(e) => setNewAudit({...newAudit, companyId: e.target.value})}
                                >
                                    <option value="">Select Company</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Auditor *</label>
                                <select 
                                    required
                                    value={newAudit.auditorId}
                                    onChange={(e) => setNewAudit({...newAudit, auditorId: e.target.value})}
                                >
                                    <option value="">Select Auditor</option>
                                    {auditors.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Scope *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Full Security Audit" 
                                    required
                                    value={newAudit.scope}
                                    onChange={(e) => setNewAudit({...newAudit, scope: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input 
                                        type="date" 
                                        value={newAudit.startDate}
                                        onChange={(e) => setNewAudit({...newAudit, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input 
                                        type="date" 
                                        value={newAudit.endDate}
                                        onChange={(e) => setNewAudit({...newAudit, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={newAudit.priority}
                                    onChange={(e) => setNewAudit({...newAudit, priority: e.target.value})}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Schedule Audit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading audits...</p>
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
                        <h2><FaClipboardList /> Audits Management</h2>
                        <p>Monitor and manage all security audit activities</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary" onClick={handleSchedule}>
                            <FaPlus /> Schedule Audit
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon blue"><FaClipboardList /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Audits</p>
                        <span className="stat-trend up">+3 this month</span>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('inProgress')}>
                        <div className="stat-icon orange"><FaClock /></div>
                        <h3>{stats.inProgress}</h3>
                        <p>In Progress</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('completed')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('pending')}>
                        <div className="stat-icon yellow"><FaClock /></div>
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>

                {/* Second Row Stats */}
                <div className="stats-grid secondary">
                    <div className="stat-card clickable" onClick={() => handleStatClick('review')}>
                        <div className="stat-icon purple"><FaEye /></div>
                        <h3>{stats.review}</h3>
                        <p>Under Review</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('totalFindings')}>
                        <div className="stat-icon teal"><FaChartBar /></div>
                        <h3>{stats.totalFindings}</h3>
                        <p>Total Findings</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')}>
                        <div className="stat-icon red"><FaExclamationTriangle /></div>
                        <h3>{stats.criticalFindings}</h3>
                        <p>Critical Findings</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('dueThisWeek')}>
                        <div className="stat-icon indigo"><FaCalendarCheck /></div>
                        <h3>{stats.dueThisWeek}</h3>
                        <p>Due This Week</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search audits..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Under Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Auditor</th>
                                <th>Scope</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Findings</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAudits.map(a => {
                                const company = companies.find(c => c.id === a.companyId);
                                const auditor = auditors.find(ad => ad.id === a.auditorId);
                                const dueDate = a.dueDate || a.endDate;
                                const isOverdue = dueDate && new Date(dueDate) < new Date() && a.status !== 'completed';
                                
                                return (
                                    <tr key={a.id} className="clickable-row" onClick={() => handleRowClick(a)}>
                                        <td><FaBuilding /> {company?.name || 'Unknown'}</td>
                                        <td><FaUserTie /> {auditor?.name || 'Unknown'}</td>
                                        <td>{a.scope || '-'}</td>
                                        <td className={isOverdue ? 'overdue' : ''}>
                                            <FaCalendarAlt /> {dueDate || '-'}
                                        </td>
                                        <td>{getStatusBadge(a.status)}</td>
                                        <td>
                                            <div className="progress-cell">
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{width: `${a.progress || 0}%`}}></div>
                                                </div>
                                                <span>{a.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            {a.findings || 0} 
                                            {(a.criticalFindings || 0) > 0 && 
                                                <span className="critical-badge-small">({a.criticalFindings} critical)</span>
                                            }
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button className="icon-btn" onClick={(e) => handleEdit(a, e)}><FaEdit /></button>
                                            <button className="icon-btn" onClick={(e) => handleDelete(a.id, e)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* MODALS */}
                <StatsModal />
                <DetailModal />
                <ScheduleModal />
            </div>
        </DashboardLayout>
    );
};

export default AdminAudits;