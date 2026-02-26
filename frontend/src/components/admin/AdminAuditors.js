import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaUserTie, FaSearch, FaEdit, FaTrash, 
    FaEnvelope, FaPhone, FaCertificate,
    FaCheckCircle, FaExclamationTriangle, FaStar,
    FaChartBar, FaAward, FaGraduationCap
} from 'react-icons/fa';
import './Admin.css';

const AdminAuditors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedAuditor, setSelectedAuditor] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Data auditors
    const [auditors, setAuditors] = useState([
        { 
            id: 1, 
            name: 'Dr. Robert Wilson', 
            email: 'robert.wilson@cyber.com',
            phone: '+62 812-3456-7890',
            specialization: 'Network Security',
            certifications: ['CISSP', 'CEH', 'CISA', 'CCNA'],
            assigned: 5,
            completed: 12,
            rating: 4.8,
            status: 'active',
            totalFindings: 45,
            experience: '12 years',
            education: 'PhD in Cybersecurity'
        },
        { 
            id: 2, 
            name: 'Lisa Anderson', 
            email: 'lisa.anderson@cyber.com',
            phone: '+62 813-9876-5432',
            specialization: 'Web Security',
            certifications: ['OSCP', 'CEH', 'CISSP', 'GWEB'],
            assigned: 3,
            completed: 8,
            rating: 4.9,
            status: 'active',
            totalFindings: 28,
            experience: '8 years',
            education: 'Master in Information Security'
        },
        { 
            id: 3, 
            name: 'Michael Chen', 
            email: 'michael.chen@cyber.com',
            phone: '+62 814-5678-1234',
            specialization: 'Cloud Security',
            certifications: ['CCSP', 'AWS Security', 'CISSP', 'Azure Security'],
            assigned: 4,
            completed: 6,
            rating: 4.7,
            status: 'active',
            totalFindings: 35,
            experience: '10 years',
            education: 'Bachelor in Computer Science'
        },
        { 
            id: 4, 
            name: 'Sarah Williams', 
            email: 'sarah.williams@cyber.com',
            phone: '+62 815-4321-8765',
            specialization: 'Application Security',
            certifications: ['CSSLP', 'CEH', 'GWEB'],
            assigned: 2,
            completed: 4,
            rating: 4.5,
            status: 'inactive',
            totalFindings: 15,
            experience: '6 years',
            education: 'Master in Software Engineering'
        }
    ]);

    // Hitung rata-rata rating
    const avgRating = (auditors.reduce((sum, a) => sum + a.rating, 0) / auditors.length).toFixed(1);

    // Hitung total certifications
    const totalCertifications = auditors.reduce((sum, a) => sum + a.certifications.length, 0);

    // Stats
    const stats = {
        total: auditors.length,
        active: auditors.filter(a => a.status === 'active').length,
        inactive: auditors.filter(a => a.status === 'inactive').length,
        totalAssigned: auditors.reduce((sum, a) => sum + a.assigned, 0),
        totalCompleted: auditors.reduce((sum, a) => sum + a.completed, 0),
        totalFindings: auditors.reduce((sum, a) => sum + a.totalFindings, 0),
        avgRating: avgRating,
        totalCertifications: totalCertifications
    };

    // Filter
    const filteredAuditors = auditors.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ========== FUNGSI KLIK STATS ==========
    const handleStatClick = (type) => {
        let title = '';
        let items = [];
        
        switch(type) {
            case 'total':
                title = 'All Auditors';
                items = auditors;
                break;
            case 'active':
                title = 'Active Auditors';
                items = auditors.filter(a => a.status === 'active');
                break;
            case 'inactive':
                title = 'Inactive Auditors';
                items = auditors.filter(a => a.status === 'inactive');
                break;
            case 'assigned':
                title = 'Auditors by Assignments';
                items = auditors.sort((a, b) => b.assigned - a.assigned);
                break;
            case 'completed':
                title = 'Auditors by Completed Audits';
                items = auditors.sort((a, b) => b.completed - a.completed);
                break;
            case 'findings':
                title = 'Auditors by Total Findings';
                items = auditors.sort((a, b) => b.totalFindings - a.totalFindings);
                break;
            case 'rating':
                title = 'Auditors by Rating';
                items = auditors.sort((a, b) => b.rating - a.rating).map(a => ({
                    name: a.name,
                    rating: a.rating + ' ★',
                    specialization: a.specialization,
                    experience: a.experience
                }));
                break;
            case 'certifications':
                title = 'Certifications Overview';
                items = auditors.flatMap(a => 
                    a.certifications.map(cert => ({
                        auditor: a.name,
                        certification: cert,
                        specialization: a.specialization
                    }))
                );
                break;
            default:
                return;
        }
        
        setModalData({ show: true, title, items });
    };

    // ========== FUNGSI KLIK BARIS ==========
    const handleRowClick = (auditor) => {
        setSelectedAuditor(auditor);
        setShowDetail(true);
    };

    // ========== FUNGSI DELETE ==========
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this auditor?')) {
            setAuditors(auditors.filter(a => a.id !== id));
            alert('Auditor deleted successfully!');
        }
    };

    // ========== FUNGSI EDIT ==========
    const handleEdit = (auditor, e) => {
        e.stopPropagation();
        alert(`Edit auditor: ${auditor.name} (Demo mode)`);
    };

    // ========== MODAL DETAIL ==========
    const DetailModal = () => {
        if (!showDetail || !selectedAuditor) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowDetail(false)}>
                <div className="modal-content large" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaUserTie /> {selectedAuditor.name}</h3>
                        <button className="close-btn" onClick={() => setShowDetail(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="auditor-detail-grid">
                            <div className="detail-section">
                                <h4>Contact Information</h4>
                                <div className="detail-row"><label>Email:</label> {selectedAuditor.email}</div>
                                <div className="detail-row"><label>Phone:</label> {selectedAuditor.phone}</div>
                                <div className="detail-row"><label>Specialization:</label> {selectedAuditor.specialization}</div>
                                <div className="detail-row"><label>Experience:</label> {selectedAuditor.experience}</div>
                                <div className="detail-row"><label>Education:</label> {selectedAuditor.education}</div>
                                <div className="detail-row"><label>Status:</label> 
                                    <span className={`status-badge ${selectedAuditor.status}`}>
                                        {selectedAuditor.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4>Performance</h4>
                                <div className="detail-row"><label>Assigned Audits:</label> {selectedAuditor.assigned}</div>
                                <div className="detail-row"><label>Completed Audits:</label> {selectedAuditor.completed}</div>
                                <div className="detail-row"><label>Total Findings:</label> {selectedAuditor.totalFindings}</div>
                                <div className="detail-row"><label>Rating:</label> 
                                    <span className="rating">
                                        {selectedAuditor.rating} <FaStar className="star" />
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-section full-width">
                                <h4>Certifications ({selectedAuditor.certifications.length})</h4>
                                <div className="cert-list">
                                    {selectedAuditor.certifications.map((cert, i) => (
                                        <span key={i} className="cert-badge">
                                            <FaCertificate /> {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setShowDetail(false)}>Close</button>
                        <button className="btn-primary" onClick={(e) => handleEdit(selectedAuditor, e)}>
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
                                        <tr key={idx} className="clickable-row">
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

    return (
        <DashboardLayout role="admin">
            <div className="admin-page">
                {/* Header - TANPA BUTTON ADD */}
                <div className="page-header">
                    <div>
                        <h2><FaUserTie /> Auditors Management</h2>
                        <p>Manage security auditors and track their performance</p>
                    </div>
                </div>

                {/* Stats Cards - SEMUA BISA DI KLIK */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon purple"><FaUserTie /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Auditors</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('active')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('inactive')}>
                        <div className="stat-icon red"><FaExclamationTriangle /></div>
                        <h3>{stats.inactive}</h3>
                        <p>Inactive</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('findings')}>
                        <div className="stat-icon teal"><FaChartBar /></div>
                        <h3>{stats.totalFindings}</h3>
                        <p>Total Findings</p>
                    </div>
                </div>

                {/* Second Row Stats */}
                <div className="stats-grid secondary">
                    <div className="stat-card clickable" onClick={() => handleStatClick('assigned')}>
                        <div className="stat-icon blue"><FaUserTie /></div>
                        <h3>{stats.totalAssigned}</h3>
                        <p>Assigned Audits</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('completed')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.totalCompleted}</h3>
                        <p>Completed Audits</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('rating')}>
                        <div className="stat-icon yellow"><FaStar /></div>
                        <h3>{stats.avgRating}</h3>
                        <p>Avg Rating</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('certifications')}>
                        <div className="stat-icon indigo"><FaCertificate /></div>
                        <h3>{stats.totalCertifications}</h3>
                        <p>Certifications</p>
                    </div>
                </div>

                {/* Search */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input placeholder="Search auditors by name, email, specialization..." 
                           value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {/* Table - SETIAP BARIS BISA DI KLIK */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Specialization</th>
                                <th>Assigned</th>
                                <th>Completed</th>
                                <th>Findings</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr> </thead>
                                               <tbody>
                            {filteredAuditors.map(a => (
                                <tr key={a.id} className="clickable-row" onClick={() => handleRowClick(a)}>
                                    <td><strong>{a.name}</strong></td>
                                    <td>{a.email}</td>
                                    <td>{a.specialization}</td>
                                    <td>{a.assigned}</td>
                                    <td>{a.completed}</td>
                                    <td>{a.totalFindings}</td>
                                    <td>
                                        <span className="rating-stars">
                                            {a.rating} <FaStar className="star" />
                                        </span>
                                    </td>
                                    <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
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
            </div>
        </DashboardLayout>
    );
};

export default AdminAuditors;