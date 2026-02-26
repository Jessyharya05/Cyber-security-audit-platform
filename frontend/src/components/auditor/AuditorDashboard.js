import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaClipboardCheck, FaExclamationTriangle, FaCheckCircle,
    FaClock, FaSearch, FaBuilding, FaCalendarAlt,
    FaFilter, FaEye, FaArrowUp, FaArrowDown,
    FaTimes
} from 'react-icons/fa';
import './Auditor.css';

const AuditorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });

    // Stats data
    const stats = {
        assignedAudits: 8,
        inProgress: 3,
        completed: 5,
        criticalFindings: 2
    };

    // Assigned Audits data
    const assignedAudits = [
        { id: 1, company: 'Tech Corp', scope: 'Full Security Audit', dueDate: '2024-03-01', priority: 'high', progress: 75, auditor: 'Dr. Robert Wilson' },
        { id: 2, company: 'Finance Ltd', scope: 'Web App Security', dueDate: '2024-03-05', priority: 'critical', progress: 30, auditor: 'Lisa Anderson' },
        { id: 3, company: 'HealthCare Inc', scope: 'Compliance Audit', dueDate: '2024-02-28', priority: 'high', progress: 90, auditor: 'Michael Chen' },
        { id: 4, company: 'EduGlobal', scope: 'Network Security', dueDate: '2024-03-10', priority: 'medium', progress: 15, auditor: 'Sarah Williams' },
        { id: 5, company: 'Retail Solutions', scope: 'PCI DSS', dueDate: '2024-03-15', priority: 'high', progress: 45, auditor: 'Dr. Robert Wilson' }
    ];

    // Recent Findings data
    const recentFindings = [
        { id: 1, title: 'SQL Injection Vulnerability', company: 'Tech Corp', severity: 'critical', asset: 'Web Server', date: '2024-02-23' },
        { id: 2, title: 'Weak Password Policy', company: 'Finance Ltd', severity: 'high', asset: 'HR System', date: '2024-02-22' },
        { id: 3, title: 'Missing HTTPS', company: 'HealthCare Inc', severity: 'critical', asset: 'API Gateway', date: '2024-02-21' }
    ];

    // Upcoming Deadlines data
    const upcomingDeadlines = [
        { id: 1, task: 'Tech Corp Final Report', due: '2024-03-01', daysLeft: 3 },
        { id: 2, task: 'Finance Ltd Evidence Review', due: '2024-03-03', daysLeft: 5 },
        { id: 3, task: 'HealthCare Inc Checklist', due: '2024-02-28', daysLeft: 1 },
        { id: 4, task: 'EduGlobal Network Audit', due: '2024-03-10', daysLeft: 8 }
    ];

    // Filter audits
    const filteredAudits = assignedAudits.filter(a => 
        a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.scope.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get priority color
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
                items = assignedAudits.filter(a => a.progress > 0 && a.progress < 100);
                break;
            case 'completed':
                title = 'Completed Audits';
                items = assignedAudits.filter(a => a.progress === 100);
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
        alert(`View details for ${item.company || item.title}`);
    };

    // HANDLE FINDING CLICK
    const handleFindingClick = (finding) => {
        alert(`📋 Finding Details:\n\nTitle: ${finding.title}\nCompany: ${finding.company}\nAsset: ${finding.asset}\nSeverity: ${finding.severity}\nDate: ${finding.date}`);
    };

    // HANDLE DEADLINE CLICK
    const handleDeadlineClick = (deadline) => {
        alert(`⏰ Deadline Details:\n\nTask: ${deadline.task}\nDue: ${deadline.due}\nDays Left: ${deadline.daysLeft}`);
    };

    // MODAL COMPONENT
    const DetailModal = () => {
        if (!modalData.show) return null;

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }} onClick={() => setModalData({...modalData, show: false})}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '15px',
                        borderBottom: '2px solid #f1f5f9'
                    }}>
                        <h3 style={{ fontSize: '20px', color: '#1e293b' }}>{modalData.title}</h3>
                        <button 
                            onClick={() => setModalData({...modalData, show: false})}
                            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div>
                        {modalData.items.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No data available</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {Object.keys(modalData.items[0]).map(key => (
                                            <th key={key} style={{ textAlign: 'left', padding: '8px', background: '#f8fafc', fontSize: '12px', borderBottom: '2px solid #e2e8f0' }}>
                                                {key.toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map((item, idx) => (
                                        <tr key={idx}>
                                            {Object.values(item).map((val, i) => (
                                                <td key={i} style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>{val}</td>
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
        <DashboardLayout role="auditor">
            <div style={{ padding: '24px' }}>
                {/* Header dengan search */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                            Auditor Dashboard
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Welcome back! Manage your audits and findings.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ 
                                position: 'absolute', 
                                left: '12px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#94a3b8' 
                            }} />
                            <input 
                                type="text"
                                placeholder="Search audits..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '10px 10px 10px 40px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    width: '280px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 8px' }}>
                            <FaFilter style={{ color: '#94a3b8' }} />
                            <select 
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                style={{ border: 'none', padding: '10px', fontSize: '14px', outline: 'none' }}
                            >
                                <option value="all">All Priorities</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* STATS CARDS - SEMUA BISA DI KLIK */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    {/* Assigned Audits - KLIK */}
                    <div onClick={() => handleStatClick('assigned')} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#e8f0fe',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            marginBottom: '12px'
                        }}>
                            <FaClipboardCheck />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                            {stats.assignedAudits}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Assigned Audits</p>
                        <span style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            background: '#e6f7e6',
                            color: '#166534',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <FaArrowUp /> +2
                        </span>
                    </div>

                    {/* In Progress - KLIK */}
                    <div onClick={() => handleStatClick('inProgress')} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#fff1e6',
                            color: '#b45309',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            marginBottom: '12px'
                        }}>
                            <FaClock />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                            {stats.inProgress}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>In Progress</p>
                        <span style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            background: '#e6f7e6',
                            color: '#166534',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <FaArrowUp /> +3
                        </span>
                    </div>

                    {/* Completed - KLIK */}
                    <div onClick={() => handleStatClick('completed')} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#e6f7e6',
                            color: '#166534',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            marginBottom: '12px'
                        }}>
                            <FaCheckCircle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                            {stats.completed}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Completed</p>
                        <span style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            background: '#e6f7e6',
                            color: '#166534',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <FaArrowUp /> +5
                        </span>
                    </div>

                    {/* Critical Findings - KLIK */}
                    <div onClick={() => handleStatClick('critical')} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#fee8e8',
                            color: '#b91c1c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            marginBottom: '12px'
                        }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>
                            {stats.criticalFindings}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Critical Findings</p>
                        <span style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            background: '#fee8e8',
                            color: '#b91c1c',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <FaArrowDown /> -1
                        </span>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr', 
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* LEFT - Assigned Audits Table - SETIAP BARIS BISA DI KLIK */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaClipboardCheck /> Assigned Audits
                            </h3>
                            <a href="/auditor/risk-assessment" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                View All →
                            </a>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Company</th>
                                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Scope</th>
                                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Due</th>
                                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Priority</th>
                                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAudits.map(audit => (
                                        <tr key={audit.id} 
                                            onClick={() => handleRowClick(audit)}
                                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaBuilding style={{ color: '#64748b', fontSize: '12px' }} /> {audit.company}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{audit.scope}</td>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaCalendarAlt style={{ color: '#64748b', fontSize: '12px' }} /> {audit.dueDate}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 500,
                                                    background: `${getPriorityColor(audit.priority)}20`,
                                                    color: getPriorityColor(audit.priority)
                                                }}>
                                                    {audit.priority}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '80px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${audit.progress}%`, height: '100%', background: '#1e293b', borderRadius: '3px' }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b' }}>{audit.progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT - Recent Findings - SETIAP ITEM BISA DI KLIK */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #eef2f6'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaExclamationTriangle /> Recent Findings
                            </h3>
                            <a href="/auditor/reports" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                View All →
                            </a>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentFindings.map(finding => (
                                <div key={finding.id} 
                                    onClick={() => handleFindingClick(finding)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = '#f1f5f9';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}>
                                    <div>
                                        <h4 style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', marginBottom: '4px' }}>
                                            {finding.title}
                                        </h4>
                                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                                            {finding.company}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        background: finding.severity === 'critical' ? '#fee8e8' : '#fff1e6',
                                        color: finding.severity === 'critical' ? '#b91c1c' : '#b45309'
                                    }}>
                                        {finding.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* UPCOMING DEADLINES - SETIAP ITEM BISA DI KLIK */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #eef2f6'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <FaClock /> Upcoming Deadlines
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {upcomingDeadlines.map(deadline => (
                            <div key={deadline.id}
                                onClick={() => handleDeadlineClick(deadline)}
                                style={{
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#f1f5f9';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', marginBottom: '8px' }}>{deadline.task}</p>
                                <p style={{ fontSize: '12px', color: deadline.daysLeft <= 3 ? '#b91c1c' : '#64748b' }}>
                                    Due: {deadline.due} ({deadline.daysLeft} days left)
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODAL */}
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default AuditorDashboard;