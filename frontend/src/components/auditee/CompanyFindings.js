import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaExclamationTriangle, FaSearch, FaFilter, 
    FaEye, FaTimes, FaCheckCircle, FaClock,
    FaArrowUp, FaArrowDown, FaChartPie
} from 'react-icons/fa';
import './Auditee.css';

const CompanyFindings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });

    // ========== DATA FINDINGS ==========
    const [findings] = useState([
        { 
            id: 1, 
            title: 'SQL Injection Vulnerability', 
            asset: 'Web Server', 
            severity: 'Critical', 
            status: 'open',
            discovered: '2024-02-15',
            description: 'SQL injection vulnerability in login form allows attackers to bypass authentication'
        },
        { 
            id: 2, 
            title: 'Weak Password Policy', 
            asset: 'HR System', 
            severity: 'High', 
            status: 'in-progress',
            discovered: '2024-02-10',
            description: 'Password policy does not enforce complexity requirements'
        },
        { 
            id: 3, 
            title: 'Missing HTTPS', 
            asset: 'API Gateway', 
            severity: 'Critical', 
            status: 'open',
            discovered: '2024-02-18',
            description: 'API endpoints are not using TLS encryption'
        },
        { 
            id: 4, 
            title: 'Default Credentials', 
            asset: 'Database', 
            severity: 'High', 
            status: 'closed',
            discovered: '2024-02-05',
            description: 'Default admin credentials still active on database server'
        },
        { 
            id: 5, 
            title: 'Open Ports Detected', 
            asset: 'Firewall', 
            severity: 'Medium', 
            status: 'in-progress',
            discovered: '2024-02-12',
            description: 'Unnecessary ports open on firewall'
        }
    ]);

    // ========== STATS ==========
    const stats = {
        critical: findings.filter(f => f.severity === 'Critical').length,
        high: findings.filter(f => f.severity === 'High').length,
        medium: findings.filter(f => f.severity === 'Medium').length,
        low: findings.filter(f => f.severity === 'Low').length,
        open: findings.filter(f => f.status === 'open').length,
        inProgress: findings.filter(f => f.status === 'in-progress').length,
        closed: findings.filter(f => f.status === 'closed').length
    };

    // ========== FILTER ==========
    const filteredFindings = findings.filter(f => {
        const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             f.asset.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || f.severity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
        return matchesSearch && matchesSeverity && matchesStatus;
    });

    // ========== HANDLE STAT CLICK ==========
    const handleStatClick = (type) => {
        let title = '';
        let items = [];

        switch(type) {
            case 'critical':
                title = 'Critical Findings';
                items = findings.filter(f => f.severity === 'Critical');
                break;
            case 'high':
                title = 'High Findings';
                items = findings.filter(f => f.severity === 'High');
                break;
            case 'medium':
                title = 'Medium Findings';
                items = findings.filter(f => f.severity === 'Medium');
                break;
            case 'low':
                title = 'Low Findings';
                items = findings.filter(f => f.severity === 'Low');
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    // ========== HANDLE ROW CLICK ==========
    const handleRowClick = (finding) => {
        setModalData({
            show: true,
            title: 'Finding Details',
            items: [finding]
        });
    };

    // ========== MODAL ==========
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
                                                <td key={i}>{val}</td>
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

    // ========== GET SEVERITY COLOR ==========
    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'Critical': return { bg: '#fee8e8', color: '#b91c1c' };
            case 'High': return { bg: '#fff1e6', color: '#b45309' };
            case 'Medium': return { bg: '#fef9e7', color: '#b68b40' };
            case 'Low': return { bg: '#e6f7e6', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    // ========== GET STATUS COLOR ==========
    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return { bg: '#fee8e8', color: '#b91c1c' };
            case 'in-progress': return { bg: '#fff1e6', color: '#b45309' };
            case 'closed': return { bg: '#e6f7e6', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <DashboardLayout role="auditee">
            <div className="auditee-page" style={{ padding: '24px' }}>
                {/* Header */}
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaExclamationTriangle /> Audit Findings
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                            View and remediate security findings
                        </p>
                    </div>
                </div>

                {/* STATS CARDS - SEMUA BISA DI KLIK */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon red" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee8e8', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.critical}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Critical</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('high')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon orange" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff1e6', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.high}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>High</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('medium')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon yellow" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef9e7', color: '#b68b40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.medium}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Medium</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('low')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon green" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaCheckCircle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.low}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Low</p>
                    </div>
                </div>

                {/* Second Row Stats - Status Summary */}
                <div className="stats-grid secondary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#b91c1c', marginBottom: '4px' }}>{stats.open}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Open Findings</p>
                    </div>
                    <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#b45309', marginBottom: '4px' }}>{stats.inProgress}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>In Progress</p>
                    </div>
                    <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>{stats.closed}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Closed</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                        <FaSearch className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text"
                            placeholder="Search findings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                    <div className="filter-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                        <FaFilter style={{ color: '#94a3b8' }} />
                        <select 
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            style={{ border: 'none', padding: '10px', fontSize: '14px', outline: 'none', background: 'transparent' }}
                        >
                            <option value="all">All Severities</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="filter-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ border: 'none', padding: '10px', fontSize: '14px', outline: 'none', background: 'transparent' }}
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Findings Table */}
                <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'auto' }}>
                    <table className="auditee-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Finding</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Asset</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Severity</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Discovered</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFindings.map(finding => {
                                const severityColor = getSeverityColor(finding.severity);
                                const statusColor = getStatusColor(finding.status);
                                return (
                                    <tr key={finding.id} className="clickable-row" onClick={() => handleRowClick(finding)} style={{ cursor: 'pointer' }}>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{finding.title}</td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{finding.asset}</td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: severityColor.bg, color: severityColor.color }}>
                                                {finding.severity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: statusColor.bg, color: statusColor.color }}>
                                                {finding.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{finding.discovered}</td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
                                            <button className="icon-btn" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyFindings;