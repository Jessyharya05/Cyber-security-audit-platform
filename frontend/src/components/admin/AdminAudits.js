import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaClipboardList, FaSearch, FaPlus, FaEdit, FaTrash,
    FaEye, FaFilter, FaCalendarAlt, FaCheckCircle,
    FaClock, FaExclamationTriangle, FaUserTie,
    FaBuilding, FaChartBar, FaCalendarCheck
} from 'react-icons/fa';
import './Admin.css';

const AdminAudits = () => {
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

    // Data audits
    const [audits, setAudits] = useState([
        { 
            id: 1, 
            company: 'Tech Corp', 
            auditor: 'Dr. Robert Wilson',
            scope: 'Full Security Audit',
            startDate: '2024-02-01',
            endDate: '2024-02-28',
            dueDate: '2024-02-28',
            status: 'in-progress',
            progress: 75,
            findings: 8,
            criticalFindings: 2
        },
        { 
            id: 2, 
            company: 'Finance Ltd', 
            auditor: 'Lisa Anderson',
            scope: 'Web Application Security',
            startDate: '2024-02-05',
            endDate: '2024-03-05',
            dueDate: '2024-03-05',
            status: 'in-progress',
            progress: 30,
            findings: 5,
            criticalFindings: 1
        },
        { 
            id: 3, 
            company: 'HealthCare Inc', 
            auditor: 'Michael Chen',
            scope: 'Compliance Audit',
            startDate: '2024-02-01',
            endDate: '2024-02-28',
            dueDate: '2024-02-28',
            status: 'review',
            progress: 90,
            findings: 12,
            criticalFindings: 3
        },
        { 
            id: 4, 
            company: 'EduGlobal', 
            auditor: 'Sarah Williams',
            scope: 'Network Security',
            startDate: '2024-02-10',
            endDate: '2024-03-10',
            dueDate: '2024-03-10',
            status: 'pending',
            progress: 0,
            findings: 0,
            criticalFindings: 0
        },
        { 
            id: 5, 
            company: 'Retail Solutions', 
            auditor: 'Dr. Robert Wilson',
            scope: 'PCI DSS Compliance',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            dueDate: '2024-02-15',
            status: 'completed',
            progress: 100,
            findings: 15,
            criticalFindings: 4
        },
        { 
            id: 6, 
            company: 'Bank Central', 
            auditor: 'Lisa Anderson',
            scope: 'Financial Systems Audit',
            startDate: '2024-02-20',
            endDate: '2024-03-20',
            dueDate: '2024-03-20',
            status: 'pending',
            progress: 0,
            findings: 0,
            criticalFindings: 0
        },
        { 
            id: 7, 
            company: 'StartUp Tech', 
            auditor: 'Michael Chen',
            scope: 'Initial Security Audit',
            startDate: '2024-02-25',
            endDate: '2024-03-25',
            dueDate: '2024-03-25',
            status: 'pending',
            progress: 0,
            findings: 0,
            criticalFindings: 0
        }
    ]);

    // Hitung audits yang due this week
    const getDueThisWeek = () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return audits.filter(audit => {
            const dueDate = new Date(audit.dueDate);
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
        totalFindings: audits.reduce((sum, a) => sum + a.findings, 0),
        criticalFindings: audits.reduce((sum, a) => sum + a.criticalFindings, 0),
        dueThisWeek: dueThisWeek.length
    };

    // Filter
    const filteredAudits = audits.filter(a => {
        const matchSearch = a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.auditor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterStatus === 'all' || a.status === filterStatus;
        return matchSearch && matchFilter;
    });

    // ========== FUNGSI KLIK STATS ==========
    const handleStatClick = (type) => {
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
                items = audits.filter(a => a.criticalFindings > 0);
                break;
            case 'totalFindings':
                title = 'All Findings by Audit';
                items = audits.map(a => ({
                    company: a.company,
                    findings: a.findings,
                    critical: a.criticalFindings,
                    status: a.status
                }));
                break;
            case 'dueThisWeek':
                title = 'Audits Due This Week';
                items = dueThisWeek.map(a => ({
                    company: a.company,
                    dueDate: a.dueDate,
                    auditor: a.auditor,
                    status: a.status,
                    progress: a.progress + '%'
                }));
                break;
            default:
                return;
        }
        
        setModalData({ show: true, title, items });
    };

    // ========== FUNGSI KLIK BARIS ==========
    const handleRowClick = (audit) => {
        setSelectedAudit(audit);
        setShowDetail(true);
    };

    // ========== FUNGSI DELETE ==========
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this audit?')) {
            setAudits(audits.filter(a => a.id !== id));
            alert('Audit deleted successfully!');
        }
    };

    // ========== FUNGSI EDIT ==========
    const handleEdit = (audit, e) => {
        e.stopPropagation();
        alert(`Edit audit for ${audit.company} (Demo mode)`);
    };

    // ========== FUNGSI SCHEDULE ==========
    const handleSchedule = () => {
        setShowScheduleModal(true);
    };

    // ========== FUNGSI SCHEDULE SUBMIT ==========
    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        alert('Audit scheduled successfully! (Demo mode)');
        setShowScheduleModal(false);
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
                                    <span className="detail-value">{selectedAudit.company}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Auditor:</label>
                                    <span className="detail-value">{selectedAudit.auditor}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Scope:</label>
                                    <span className="detail-value">{selectedAudit.scope}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Due Date:</label>
                                    <span className="detail-value">{selectedAudit.dueDate}</span>
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
                                            <div className="progress-fill" style={{width: `${selectedAudit.progress}%`}}></div>
                                        </div>
                                        <span>{selectedAudit.progress}%</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <label>Total Findings:</label>
                                    <span className="detail-value">{selectedAudit.findings}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Critical Findings:</label>
                                    <span className="detail-value critical-text">{selectedAudit.criticalFindings}</span>
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
                        <button className="close-btn" onClick={() => setModalData({...modalData, show: false})}>×</button>
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
                                        <tr key={idx} onClick={() => {
                                            if (item.id) {
                                                setModalData({...modalData, show: false});
                                                handleRowClick(item);
                                            }
                                        }} className={item.id ? 'clickable-row' : ''}>
                                            {Object.values(item).map((val, i) => (
                                                <td key={i}>
                                                    {typeof val === 'number' && i === Object.keys(item).length - 1 && val > 0 ? (
                                                        <span className="critical-badge-small">{val}</span>
                                                    ) : (
                                                        val
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
                    <h3>Schedule New Audit</h3>
                    <form onSubmit={handleScheduleSubmit}>
                        <div className="form-group">
                            <label>Company</label>
                            <select required>
                                <option value="">Select Company</option>
                                <option>Tech Corp</option>
                                <option>Finance Ltd</option>
                                <option>HealthCare Inc</option>
                                <option>EduGlobal</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Auditor</label>
                            <select required>
                                <option value="">Select Auditor</option>
                                <option>Dr. Robert Wilson</option>
                                <option>Lisa Anderson</option>
                                <option>Michael Chen</option>
                                <option>Sarah Williams</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Scope</label>
                            <input type="text" placeholder="e.g., Full Security Audit" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Due Date</label>
                                <input type="date" required />
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

                {/* Stats Cards - SEMUA BISA DI KLIK */}
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

                {/* Table - SETIAP BARIS BISA DI KLIK */}
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
                            {filteredAudits.map(a => (
                                <tr key={a.id} className="clickable-row" onClick={() => handleRowClick(a)}>
                                    <td><FaBuilding /> {a.company}</td>
                                    <td><FaUserTie /> {a.auditor}</td>
                                    <td>{a.scope}</td>
                                    <td className={new Date(a.dueDate) < new Date() && a.status !== 'completed' ? 'overdue' : ''}>
                                        <FaCalendarAlt /> {a.dueDate}
                                    </td>
                                    <td>{getStatusBadge(a.status)}</td>
                                    <td>
                                        <div className="progress-cell">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{width: `${a.progress}%`}}></div>
                                            </div>
                                            <span>{a.progress}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        {a.findings} 
                                        {a.criticalFindings > 0 && 
                                            <span className="critical-badge-small">({a.criticalFindings} critical)</span>
                                        }
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button className="icon-btn" onClick={(e) => handleEdit(a, e)}><FaEdit /></button>
                                        <button className="icon-btn" onClick={(e) => handleDelete(a.id, e)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
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