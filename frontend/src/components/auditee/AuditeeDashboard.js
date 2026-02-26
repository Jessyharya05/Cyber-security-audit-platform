import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaServer, FaUpload, FaExclamationTriangle,
    FaShieldAlt, FaArrowUp, FaSearch,
    FaBell, FaFileAlt, FaDownload,
    FaBuilding, FaUser, FaClock, FaChartBar
} from 'react-icons/fa';
import './Auditee.css';

const AuditeeDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });

    // Stats
    const stats = {
        totalAssets: 24,
        pendingEvidence: 5,
        openFindings: 3,
        complianceRate: 72,
        criticalFindings: 1,
        highFindings: 2,
        completedAudits: 4
    };

    // Assets
    const assets = [
        { id: 1, name: 'Web Server', type: 'Server', owner: 'IT Dept', cia: 'High', criticality: 8.5 },
        { id: 2, name: 'Customer Database', type: 'Database', owner: 'IT Dept', cia: 'Critical', criticality: 9.2 },
        { id: 3, name: 'HR Application', type: 'Application', owner: 'HR Dept', cia: 'Medium', criticality: 6.8 },
        { id: 4, name: 'Firewall', type: 'Network', owner: 'IT Dept', cia: 'High', criticality: 8.0 }
    ];

    // Evidence
    const evidence = [
        { control: 'Password Policy', asset: 'HR System', due: '2024-03-01', status: 'pending' },
        { control: 'Backup Procedure', asset: 'Database', due: '2024-03-03', status: 'uploaded' },
        { control: 'Access Control List', asset: 'File Server', due: '2024-02-28', status: 'overdue' }
    ];

    // Findings
    const findings = [
        { title: 'SQL Injection', asset: 'Web Server', severity: 'critical', status: 'open' },
        { title: 'Weak Password', asset: 'HR System', severity: 'high', status: 'in-progress' },
        { title: 'Missing HTTPS', asset: 'API Gateway', severity: 'critical', status: 'open' }
    ];

    // NIST Scores
    const nistScores = {
        identify: 68,
        protect: 72,
        detect: 45,
        respond: 80,
        recover: 55
    };

    // Compliance breakdown data
    const complianceBreakdown = [
        { function: 'Identify', score: 68, status: 'Good', controls: '12/18 compliant' },
        { function: 'Protect', score: 72, status: 'Good', controls: '18/25 compliant' },
        { function: 'Detect', score: 45, status: 'Needs Improvement', controls: '9/20 compliant' },
        { function: 'Respond', score: 80, status: 'Excellent', controls: '12/15 compliant' },
        { function: 'Recover', score: 55, status: 'Fair', controls: '8/15 compliant' }
    ];

    const handleStatClick = (type) => {
        let items = [];
        let title = '';

        switch(type) {
            case 'assets': 
                items = assets; 
                title = 'Asset Inventory'; 
                break;
            case 'evidence': 
                items = evidence; 
                title = 'Evidence Required'; 
                break;
            case 'findings': 
                items = findings; 
                title = 'Audit Findings'; 
                break;
            case 'compliance':
                items = complianceBreakdown;
                title = 'Compliance Breakdown by NIST CSF';
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    const DetailModal = () => {
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
                                        {Object.keys(modalData.items[0]).map(k => (
                                            <th key={k}>{k.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map((item, i) => (
                                        <tr key={i}>
                                            {Object.values(item).map((v, j) => (
                                                <td key={j}>
                                                    {typeof v === 'number' && v < 60 ? (
                                                        <span style={{ color: '#b91c1c', fontWeight: 600 }}>{v}%</span>
                                                    ) : typeof v === 'number' && v > 80 ? (
                                                        <span style={{ color: '#166534', fontWeight: 600 }}>{v}%</span>
                                                    ) : (
                                                        v
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

    return (
        <DashboardLayout role="auditee">
            <div className="auditee-dashboard" style={{ padding: '24px' }}>
                {/* Header */}
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Company Dashboard</h1>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Manage your assets and audit evidence</p>
                    </div>
                    <div className="header-search" style={{ position: 'relative', width: '300px' }}>
                        <FaSearch className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            placeholder="Search assets, evidence..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                </div>

                {/* Stats - COMPLIANCE RATE SEKARANG BISA DI KLIK */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card clickable" onClick={() => handleStatClick('assets')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon blue" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f0fe', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaServer />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.totalAssets}</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Total Assets</p>
                        </div>
                        <div className="stat-trend up" style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '12px', padding: '4px 8px', borderRadius: '20px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaArrowUp /> +3
                        </div>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('evidence')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon orange" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff1e6', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaUpload />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.pendingEvidence}</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Evidence Pending</p>
                        </div>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('findings')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon red" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee8e8', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaExclamationTriangle />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.openFindings}</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Open Findings</p>
                        </div>
                    </div>

                    {/* COMPLIANCE RATE - SEKARANG BISA DI KLIK */}
                    <div className="stat-card clickable" onClick={() => handleStatClick('compliance')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon green" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaShieldAlt />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.complianceRate}%</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Compliance Rate</p>
                        </div>
                        <div className="stat-trend up" style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '12px', padding: '4px 8px', borderRadius: '20px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaArrowUp /> +5%
                        </div>
                    </div>
                </div>

                {/* Main Grid - Assets List & NIST CSF */}
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    {/* Assets List */}
                    <div className="dashboard-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaServer /> Asset Inventory
                            </h3>
                            <a href="/auditee/assets" className="view-all" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>View All →</a>
                        </div>
                        {assets.map(a => (
                            <div key={a.id} className="asset-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div className="asset-info">
                                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', marginBottom: '4px' }}>{a.name}</h4>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{a.type} · {a.owner}</p>
                                </div>
                                <div className="asset-meta" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span className={`cia-badge ${a.cia.toLowerCase()}`} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: a.cia === 'Critical' ? '#fee8e8' : a.cia === 'High' ? '#fff1e6' : '#e6f7e6', color: a.cia === 'Critical' ? '#b91c1c' : a.cia === 'High' ? '#b45309' : '#166534' }}>{a.cia}</span>
                                    <span className="criticality" style={{ fontWeight: 600, color: '#1e293b' }}>{a.criticality}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* NIST CSF Compliance */}
                    <div className="dashboard-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <div className="card-header" style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaShieldAlt /> NIST CSF Compliance
                            </h3>
                        </div>
                        <div className="nist-scores">
                            {Object.entries(nistScores).map(([key, value]) => (
                                <div key={key} className="nist-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <span className="nist-label" style={{ width: '70px', fontSize: '13px', color: '#64748b', textTransform: 'capitalize' }}>{key}</span>
                                    <div className="progress-bar" style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div className="progress-fill" style={{ width: `${value}%`, height: '100%', background: '#1e293b', borderRadius: '4px' }}></div>
                                    </div>
                                    <span className="nist-value" style={{ width: '45px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second Grid - Evidence & Findings */}
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    {/* Evidence List */}
                    <div className="dashboard-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaUpload /> Evidence Required
                            </h3>
                            <a href="/auditee/evidence" className="view-all" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>View All →</a>
                        </div>
                        {evidence.map((e, i) => (
                            <div key={i} className="evidence-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div className="evidence-info">
                                    <h4 style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', marginBottom: '2px' }}>{e.control}</h4>
                                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{e.asset} · Due: {e.due}</p>
                                </div>
                                <span className={`status-badge ${e.status}`} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: e.status === 'uploaded' ? '#e6f7e6' : e.status === 'overdue' ? '#fee8e8' : '#f1f5f9', color: e.status === 'uploaded' ? '#166534' : e.status === 'overdue' ? '#b91c1c' : '#64748b' }}>{e.status}</span>
                            </div>
                        ))}
                    </div>

                    {/* Findings List */}
                    <div className="dashboard-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaExclamationTriangle /> Recent Findings
                            </h3>
                            <a href="/auditee/findings" className="view-all" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>View All →</a>
                        </div>
                        {findings.map((f, i) => (
                            <div key={i} className="finding-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div className="finding-info">
                                    <h4 style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', marginBottom: '2px' }}>{f.title}</h4>
                                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{f.asset}</p>
                                </div>
                                <div className="finding-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span className={`severity-badge ${f.severity}`} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: f.severity === 'critical' ? '#fee8e8' : '#fff1e6', color: f.severity === 'critical' ? '#b91c1c' : '#b45309' }}>{f.severity}</span>
                                    <span className={`status-badge ${f.status}`} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: f.status === 'closed' ? '#e6f7e6' : f.status === 'in-progress' ? '#fff1e6' : '#fee8e8', color: f.status === 'closed' ? '#166534' : f.status === 'in-progress' ? '#b45309' : '#b91c1c' }}>{f.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '24px' }}>
                    <button className="quick-action-btn" onClick={() => window.location.href = '/auditee/assets'} style={{ padding: '20px', background: 'white', border: '1px solid #eef2f6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <FaServer style={{ fontSize: '24px', color: '#1e293b' }} />
                        <span style={{ fontSize: '12px', color: '#1e293b' }}>Add Asset</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => window.location.href = '/auditee/evidence'} style={{ padding: '20px', background: 'white', border: '1px solid #eef2f6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <FaUpload style={{ fontSize: '24px', color: '#1e293b' }} />
                        <span style={{ fontSize: '12px', color: '#1e293b' }}>Upload Evidence</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => window.location.href = '/auditee/reports'} style={{ padding: '20px', background: 'white', border: '1px solid #eef2f6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <FaFileAlt style={{ fontSize: '24px', color: '#1e293b' }} />
                        <span style={{ fontSize: '12px', color: '#1e293b' }}>View Report</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => window.location.href = '/auditee/findings'} style={{ padding: '20px', background: 'white', border: '1px solid #eef2f6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <FaDownload style={{ fontSize: '24px', color: '#1e293b' }} />
                        <span style={{ fontSize: '12px', color: '#1e293b' }}>Export Data</span>
                    </button>
                </div>

                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default AuditeeDashboard;