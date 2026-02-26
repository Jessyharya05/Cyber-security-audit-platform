// src/components/auditor/AuditorDashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaClipboardCheck, FaExclamationTriangle, FaCheckCircle,
    FaClock, FaSearch, FaBuilding, FaCalendarAlt,
    FaFilter, FaEye, FaArrowUp, FaArrowDown,
    FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditor.css';

const AuditorDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });

    // State untuk data dari database
    const [stats, setStats] = useState({
        assignedAudits: 0,
        inProgress: 0,
        completed: 0,
        criticalFindings: 0
    });

    const [assignedAudits, setAssignedAudits] = useState([]);
    const [recentFindings, setRecentFindings] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Ambil data auditor ID dari user
            const auditorId = user?.id;
            
            // 1. Ambil semua audits yang diassign ke auditor ini
            const auditsRes = await api.get('/audit/');
            const allAudits = auditsRes.data || [];
            const myAudits = allAudits.filter(a => a.auditorId === auditorId);
            setAssignedAudits(myAudits);
            
            // 2. Ambil semua findings
            const findingsRes = await api.get('/findings/');
            const allFindings = findingsRes.data || [];
            
            // Filter findings untuk company yang diaudit oleh auditor ini
            const myCompanyIds = [...new Set(myAudits.map(a => a.companyId))];
            const myFindings = allFindings.filter(f => myCompanyIds.includes(f.company_id));
            setRecentFindings(myFindings.slice(0, 3));
            
            // Hitung stats
            const inProgress = myAudits.filter(a => a.status === 'in-progress').length;
            const completed = myAudits.filter(a => a.status === 'completed').length;
            const criticalFindings = myFindings.filter(f => f.severity === 'critical').length;
            
            setStats({
                assignedAudits: myAudits.length,
                inProgress,
                completed,
                criticalFindings
            });

            // Set upcoming deadlines
            const deadlines = myAudits
                .filter(a => a.status !== 'completed' && a.dueDate)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 4)
                .map(a => ({
                    id: a.id,
                    task: `${a.companyName || 'Company'} Audit Report`,
                    due: a.dueDate,
                    daysLeft: calculateDaysLeft(a.dueDate)
                }));
            setUpcomingDeadlines(deadlines);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysLeft = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'critical': return '#b91c1c';
            case 'high': return '#b45309';
            case 'medium': return '#b68b40';
            default: return '#64748b';
        }
    };

    // HANDLE STATS CLICK
    const handleStatClick = (type) => {
        let title = '';
        let items = [];

        switch(type) {
            case 'assigned':
                title = 'All Assigned Audits';
                items = assignedAudits;
                break;
            case 'inProgress':
                title = 'Audits In Progress';
                items = assignedAudits.filter(a => a.status === 'in-progress');
                break;
            case 'completed':
                title = 'Completed Audits';
                items = assignedAudits.filter(a => a.status === 'completed');
                break;
            case 'critical':
                title = 'Critical Findings';
                items = recentFindings.filter(f => f.severity === 'critical');
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    // HANDLE ROW CLICK
    const handleRowClick = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // HANDLE FINDING CLICK
    const handleFindingClick = (finding) => {
        setSelectedItem(finding);
        setShowDetailModal(true);
    };

    // HANDLE DEADLINE CLICK
    const handleDeadlineClick = (deadline) => {
        const audit = assignedAudits.find(a => a.id === deadline.id);
        if (audit) {
            setSelectedItem(audit);
            setShowDetailModal(true);
        }
    };

    // MODAL DETAIL
    const DetailModal = () => {
        if (!showDetailModal || !selectedItem) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaEye /> Detail Information</h3>
                        <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        {Object.entries(selectedItem).map(([key, value]) => (
                            <div key={key} className="detail-row">
                                <label>{key}:</label>
                                <span>{value?.toString() || '-'}</span>
                            </div>
                        ))}
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    // MODAL STATS
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
                                            <th key={key}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map((item, idx) => (
                                        <tr key={idx} onClick={() => {
                                            setSelectedItem(item);
                                            setShowDetailModal(true);
                                            setModalData({...modalData, show: false});
                                        }} className="clickable-row">
                                            {Object.values(item).map((val, i) => (
                                                <td key={i}>{val?.toString() || '-'}</td>
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

    // Filter audits
    const filteredAudits = assignedAudits.filter(a => 
        (a.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.scope || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout role="auditor">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="auditor">
            <div className="auditor-dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Auditor Dashboard</h1>
                        <p>Welcome back, {user?.name}! Manage your audits and findings.</p>
                    </div>
                    <div className="header-search">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search audits..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('assigned')}>
                        <div className="stat-icon blue"><FaClipboardCheck /></div>
                        <div className="stat-content">
                            <h3>{stats.assignedAudits}</h3>
                            <p>Assigned Audits</p>
                        </div>
                        <div className="stat-trend up"><FaArrowUp /> +{stats.assignedAudits}</div>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('inProgress')}>
                        <div className="stat-icon orange"><FaClock /></div>
                        <div className="stat-content">
                            <h3>{stats.inProgress}</h3>
                            <p>In Progress</p>
                        </div>
                        <div className="stat-trend up"><FaArrowUp /> +{stats.inProgress}</div>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('completed')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <div className="stat-content">
                            <h3>{stats.completed}</h3>
                            <p>Completed</p>
                        </div>
                        <div className="stat-trend up"><FaArrowUp /> +{stats.completed}</div>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')}>
                        <div className="stat-icon red"><FaExclamationTriangle /></div>
                        <div className="stat-content">
                            <h3>{stats.criticalFindings}</h3>
                            <p>Critical Findings</p>
                        </div>
                        <div className="stat-trend down"><FaArrowDown /> -1</div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="dashboard-grid">
                    {/* LEFT - Assigned Audits */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3><FaClipboardCheck /> Assigned Audits</h3>
                            <a href="/auditor/risk-assessment" className="view-all">View All →</a>
                        </div>
                        <div className="table-responsive">
                            <table className="auditor-table">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Scope</th>
                                        <th>Due</th>
                                        <th>Priority</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAudits.slice(0, 5).map(audit => (
                                        <tr key={audit.id} onClick={() => handleRowClick(audit)} className="clickable-row">
                                            <td><FaBuilding /> {audit.companyName || 'Unknown'}</td>
                                            <td>{audit.scope || '-'}</td>
                                            <td><FaCalendarAlt /> {audit.dueDate || audit.endDate || '-'}</td>
                                            <td>
                                                <span className={`priority-badge ${audit.priority || 'medium'}`}>
                                                    {audit.priority || 'medium'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="progress-cell">
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{width: `${audit.progress || 0}%`}}></div>
                                                    </div>
                                                    <span>{audit.progress || 0}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT - Recent Findings */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3><FaExclamationTriangle /> Recent Findings</h3>
                            <a href="/auditor/reports" className="view-all">View All →</a>
                        </div>
                        <div className="findings-list">
                            {recentFindings.map(finding => (
                                <div key={finding.id} className="finding-item" onClick={() => handleFindingClick(finding)}>
                                    <div className="finding-info">
                                        <h4>{finding.title}</h4>
                                        <p>{finding.asset} · {finding.companyName || 'Company'}</p>
                                    </div>
                                    <span className={`severity-badge ${finding.severity}`}>
                                        {finding.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* UPCOMING DEADLINES */}
                <div className="dashboard-card full-width">
                    <div className="card-header">
                        <h3><FaClock /> Upcoming Deadlines</h3>
                    </div>
                    <div className="deadlines-grid">
                        {upcomingDeadlines.map(deadline => (
                            <div key={deadline.id} className="deadline-card" onClick={() => handleDeadlineClick(deadline)}>
                                <h4>{deadline.task}</h4>
                                <p className="deadline-date">Due: {deadline.due}</p>
                                <p className={`days-left ${deadline.daysLeft <= 3 ? 'urgent' : ''}`}>
                                    {deadline.daysLeft} days left
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODALS */}
                <StatsModal />
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default AuditorDashboard;