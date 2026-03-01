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
    const [modalData, setModalData] = useState({ show: false, title: '', items: [] });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

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
            // ✅ FIX: Backend sudah filter by auditor yang login — tidak perlu filter lagi di frontend
            const auditsRes = await api.get('/audit/');
            const myAudits = auditsRes.data || [];
            setAssignedAudits(myAudits);

            // ✅ FIX: Backend sudah filter findings by company auditor yang login
            const findingsRes = await api.get('/findings/');
            const myFindings = findingsRes.data || [];
            setRecentFindings(myFindings.slice(0, 3));

            // Hitung stats
            setStats({
                assignedAudits: myAudits.length,
                inProgress: myAudits.filter(a => a.status === 'in-progress').length,
                completed: myAudits.filter(a => a.status === 'completed').length,
                criticalFindings: myFindings.filter(f => f.severity === 'critical').length
            });

            // Upcoming deadlines
            const deadlines = myAudits
                .filter(a => a.status !== 'completed' && (a.endDate || a.dueDate))
                .sort((a, b) => new Date(a.endDate || a.dueDate) - new Date(b.endDate || b.dueDate))
                .slice(0, 4)
                .map(a => ({
                    id: a.id,
                    task: `${a.companyName || 'Company'} Audit Report`,
                    due: a.endDate || a.dueDate || '-',
                    daysLeft: calculateDaysLeft(a.endDate || a.dueDate)
                }));
            setUpcomingDeadlines(deadlines);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysLeft = (dueDate) => {
        if (!dueDate) return 0;
        const due = new Date(dueDate);
        const today = new Date();
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleStatClick = (type) => {
        let title = '';
        let items = [];
        switch(type) {
            case 'assigned': title = 'All Assigned Audits'; items = assignedAudits; break;
            case 'inProgress': title = 'Audits In Progress'; items = assignedAudits.filter(a => a.status === 'in-progress'); break;
            case 'completed': title = 'Completed Audits'; items = assignedAudits.filter(a => a.status === 'completed'); break;
            case 'critical': title = 'Critical Findings'; items = recentFindings.filter(f => f.severity === 'critical'); break;
            default: return;
        }
        setModalData({ show: true, title, items });
    };

    const filteredAudits = assignedAudits.filter(a =>
        (a.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.scope || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                    <tr>{Object.keys(modalData.items[0]).map(key => <th key={key}>{key}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map((item, idx) => (
                                        <tr key={idx} onClick={() => {
                                            setSelectedItem(item);
                                            setShowDetailModal(true);
                                            setModalData({...modalData, show: false});
                                        }} className="clickable-row">
                                            {Object.values(item).map((val, i) => <td key={i}>{val?.toString() || '-'}</td>)}
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
                        <p>Welcome back, {user?.fullname || user?.name}! Manage your audits and findings.</p>
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
                        <div className="stat-trend down"><FaArrowDown /> -{stats.criticalFindings}</div>
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
                                    {filteredAudits.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign:'center', color:'#94a3b8', padding:'20px'}}>No audits assigned</td></tr>
                                    ) : (
                                        filteredAudits.slice(0, 5).map(audit => (
                                            <tr key={audit.id} onClick={() => { setSelectedItem(audit); setShowDetailModal(true); }} className="clickable-row">
                                                <td><FaBuilding /> {audit.companyName || 'Unknown'}</td>
                                                <td>{audit.scope || '-'}</td>
                                                <td><FaCalendarAlt /> {audit.endDate || audit.dueDate || '-'}</td>
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
                                        ))
                                    )}
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
                            {recentFindings.length === 0 ? (
                                <p style={{textAlign:'center', color:'#94a3b8', padding:'20px'}}>No findings yet</p>
                            ) : (
                                recentFindings.map(finding => (
                                    <div key={finding.id} className="finding-item" onClick={() => { setSelectedItem(finding); setShowDetailModal(true); }}>
                                        <div className="finding-info">
                                            <h4>{finding.title}</h4>
                                            <p>{finding.asset} · {finding.companyName || 'Company'}</p>
                                        </div>
                                        <span className={`severity-badge ${finding.severity}`}>
                                            {finding.severity}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* UPCOMING DEADLINES */}
                <div className="dashboard-card full-width">
                    <div className="card-header">
                        <h3><FaClock /> Upcoming Deadlines</h3>
                    </div>
                    <div className="deadlines-grid">
                        {upcomingDeadlines.length === 0 ? (
                            <p style={{color:'#94a3b8', padding:'10px'}}>No upcoming deadlines</p>
                        ) : (
                            upcomingDeadlines.map(deadline => (
                                <div key={deadline.id} className="deadline-card" onClick={() => {
                                    const audit = assignedAudits.find(a => a.id === deadline.id);
                                    if (audit) { setSelectedItem(audit); setShowDetailModal(true); }
                                }}>
                                    <h4>{deadline.task}</h4>
                                    <p className="deadline-date">Due: {deadline.due}</p>
                                    <p className={`days-left ${deadline.daysLeft <= 3 ? 'urgent' : ''}`}>
                                        {deadline.daysLeft} days left
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <StatsModal />
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default AuditorDashboard;