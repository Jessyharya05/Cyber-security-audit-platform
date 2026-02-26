// src/components/auditee/CompanyFindings.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaExclamationTriangle, FaSearch, FaFilter, 
    FaEye, FaTimes, FaCheckCircle, FaClock,
    FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditee.css';

const CompanyFindings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [findings, setFindings] = useState([]);
    const [modalData, setModalData] = useState({ show: false, title: '', items: [] });

    useEffect(() => {
        fetchFindings();
    }, []);

    const fetchFindings = async () => {
        setLoading(true);
        try {
            const companyId = user?.companyId || 1;
            const response = await api.get(`/findings/company/${companyId}`);
            setFindings(response.data || []);
        } catch (error) {
            console.error('Error fetching findings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = {
        critical: findings.filter(f => f.severity === 'critical').length,
        high: findings.filter(f => f.severity === 'high').length,
        medium: findings.filter(f => f.severity === 'medium').length,
        low: findings.filter(f => f.severity === 'low').length,
        open: findings.filter(f => f.status === 'open').length,
        inProgress: findings.filter(f => f.status === 'in-progress').length,
        closed: findings.filter(f => f.status === 'closed').length
    };

    // Filter
    const filteredFindings = findings.filter(f => {
        const matchesSearch = f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             f.asset?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || f.severity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
        return matchesSearch && matchesSeverity && matchesStatus;
    });

    // Handle stat click
    const handleStatClick = (type) => {
        let title = '';
        let items = [];

        switch(type) {
            case 'critical':
                title = 'Critical Findings';
                items = findings.filter(f => f.severity === 'critical');
                break;
            case 'high':
                title = 'High Findings';
                items = findings.filter(f => f.severity === 'high');
                break;
            case 'medium':
                title = 'Medium Findings';
                items = findings.filter(f => f.severity === 'medium');
                break;
            case 'low':
                title = 'Low Findings';
                items = findings.filter(f => f.severity === 'low');
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    // Handle row click
    const handleRowClick = (finding) => {
        setModalData({ show: true, title: 'Finding Details', items: [finding] });
    };

    // Modal
    const DetailModal = () => {
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
                                        <tr key={idx}>
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

    // Get severity color
    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'critical': return { bg: '#fee8e8', color: '#b91c1c' };
            case 'high': return { bg: '#fff1e6', color: '#b45309' };
            case 'medium': return { bg: '#fef9e7', color: '#b68b40' };
            case 'low': return { bg: '#e6f7e6', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return { bg: '#fee8e8', color: '#b91c1c' };
            case 'in-progress': return { bg: '#fff1e6', color: '#b45309' };
            case 'closed': return { bg: '#e6f7e6', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="auditee">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading findings...</p>
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
                        <h2><FaExclamationTriangle /> Audit Findings</h2>
                        <p>View and remediate security findings</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')}>
                        <div className="stat-icon red"><FaExclamationTriangle /></div>
                        <h3>{stats.critical}</h3>
                        <p>Critical</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('high')}>
                        <div className="stat-icon orange"><FaExclamationTriangle /></div>
                        <h3>{stats.high}</h3>
                        <p>High</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('medium')}>
                        <div className="stat-icon yellow"><FaExclamationTriangle /></div>
                        <h3>{stats.medium}</h3>
                        <p>Medium</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('low')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.low}</h3>
                        <p>Low</p>
                    </div>
                </div>

                {/* Status Summary */}
                <div className="stats-grid secondary">
                    <div className="stat-card">
                        <h3 style={{ color: '#b91c1c' }}>{stats.open}</h3>
                        <p>Open Findings</p>
                    </div>
                    <div className="stat-card">
                        <h3 style={{ color: '#b45309' }}>{stats.inProgress}</h3>
                        <p>In Progress</p>
                    </div>
                    <div className="stat-card">
                        <h3 style={{ color: '#166534' }}>{stats.closed}</h3>
                        <p>Closed</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search findings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div className="filter-box">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Findings Table */}
                <div className="table-container">
                    <table className="auditee-table">
                        <thead>
                            <tr>
                                <th>Finding</th>
                                <th>Asset</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Discovered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFindings.map(finding => {
                                const severityColor = getSeverityColor(finding.severity);
                                const statusColor = getStatusColor(finding.status);
                                return (
                                    <tr key={finding.id} className="clickable-row" onClick={() => handleRowClick(finding)}>
                                        <td><strong>{finding.title}</strong></td>
                                        <td>{finding.asset}</td>
                                        <td>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: severityColor.bg, color: severityColor.color }}>
                                                {finding.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: statusColor.bg, color: statusColor.color }}>
                                                {finding.status}
                                            </span>
                                        </td>
                                        <td>{finding.discovered}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button className="icon-btn"><FaEye /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyFindings;