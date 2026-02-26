// ============================================
// src/components/admin/AdminAuditors.js
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaUserTie, FaSearch, FaEdit, FaTrash, 
    FaEnvelope, FaPhone, FaCertificate,
    FaCheckCircle, FaExclamationTriangle, FaStar,
    FaChartBar, FaAward, FaGraduationCap,
    FaPlus, FaTimes
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const AdminAuditors = () => {
    const [loading, setLoading] = useState(true);
    const [auditors, setAuditors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedAuditor, setSelectedAuditor] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAuditor, setNewAuditor] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: 'General',
        certifications: '',
        experience: '',
        education: ''
    });

    useEffect(() => {
        fetchAuditors();
    }, []);

    const fetchAuditors = async () => {
        setLoading(true);
        try {
            // Ambil semua users dengan role auditor
            const response = await api.get('/users/?role=auditor');
            setAuditors(response.data || []);
        } catch (error) {
            console.error('Error fetching auditors:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hitung stats
    const stats = {
        total: auditors.length,
        active: auditors.filter(a => a.status === 'active').length,
        inactive: auditors.filter(a => a.status === 'inactive').length,
        totalAssigned: auditors.reduce((sum, a) => sum + (a.assigned || 0), 0),
        totalCompleted: auditors.reduce((sum, a) => sum + (a.completed || 0), 0),
        totalFindings: auditors.reduce((sum, a) => sum + (a.totalFindings || 0), 0),
        avgRating: (auditors.reduce((sum, a) => sum + (a.rating || 0), 0) / (auditors.length || 1)).toFixed(1),
        totalCertifications: auditors.reduce((sum, a) => sum + (a.certifications?.length || 0), 0)
    };

    // Filter
    const filteredAuditors = auditors.filter(a => 
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle klik stats
    const handleStatClick = async (type) => {
        try {
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
                    items = [...auditors].sort((a, b) => (b.assigned || 0) - (a.assigned || 0));
                    break;
                case 'completed':
                    title = 'Auditors by Completed Audits';
                    items = [...auditors].sort((a, b) => (b.completed || 0) - (a.completed || 0));
                    break;
                case 'findings':
                    title = 'Auditors by Total Findings';
                    items = [...auditors].sort((a, b) => (b.totalFindings || 0) - (a.totalFindings || 0));
                    break;
                case 'rating':
                    title = 'Auditors by Rating';
                    items = [...auditors].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                default:
                    return;
            }

            setModalData({ show: true, title, items });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle klik baris
    const handleRowClick = (auditor) => {
        setSelectedAuditor(auditor);
        setShowDetail(true);
    };

    // Handle delete
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this auditor?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchAuditors();
                alert('Auditor deleted successfully!');
            } catch (error) {
                console.error('Error deleting auditor:', error);
                alert('Failed to delete auditor');
            }
        }
    };

    // Handle edit
    const handleEdit = (auditor, e) => {
        e.stopPropagation();
        alert(`Edit auditor: ${auditor.name} (Demo mode)`);
    };

    // Handle add auditor
    const handleAddAuditor = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', {
                fullname: newAuditor.name,
                email: newAuditor.email,
                password: 'default123', // Default password
                role: 'auditor'
            });
            
            if (response.data.success) {
                fetchAuditors();
                setShowAddModal(false);
                setNewAuditor({
                    name: '',
                    email: '',
                    phone: '',
                    specialization: 'General',
                    certifications: '',
                    experience: '',
                    education: ''
                });
                alert('Auditor added successfully! Default password: default123');
            }
        } catch (error) {
            console.error('Error adding auditor:', error);
            alert('Failed to add auditor');
        }
    };

    // Modal Detail
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
                                <div className="detail-row"><FaEnvelope /> {selectedAuditor.email}</div>
                                <div className="detail-row"><FaPhone /> {selectedAuditor.phone || '-'}</div>
                                <div className="detail-row"><FaAward /> Specialization: {selectedAuditor.specialization || 'General'}</div>
                                <div className="detail-row"><FaGraduationCap /> Education: {selectedAuditor.education || '-'}</div>
                                <div className="detail-row"><FaChartBar /> Experience: {selectedAuditor.experience || '-'}</div>
                                <div className="detail-row">Status: 
                                    <span className={`status-badge ${selectedAuditor.status || 'active'}`}>
                                        {selectedAuditor.status || 'active'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4>Performance</h4>
                                <div className="detail-row">Assigned Audits: {selectedAuditor.assigned || 0}</div>
                                <div className="detail-row">Completed Audits: {selectedAuditor.completed || 0}</div>
                                <div className="detail-row">Total Findings: {selectedAuditor.totalFindings || 0}</div>
                                <div className="detail-row">Rating: 
                                    <span className="rating">
                                        {selectedAuditor.rating || 0} <FaStar className="star" />
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-section full-width">
                                <h4>Certifications</h4>
                                <div className="cert-list">
                                    {selectedAuditor.certifications?.length ? (
                                        selectedAuditor.certifications.map((cert, i) => (
                                            <span key={i} className="cert-badge">
                                                <FaCertificate /> {cert}
                                            </span>
                                        ))
                                    ) : (
                                        <p>No certifications listed</p>
                                    )}
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

    // Modal Stats
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
                                        <tr key={idx} className="clickable-row"
                                            onClick={() => {
                                                if (item.id) {
                                                    setModalData({...modalData, show: false});
                                                    handleRowClick(item);
                                                }
                                            }}
                                        >
                                            {Object.values(item).map((val, i) => (
                                                <td key={i}>
                                                    {typeof val === 'object' ? JSON.stringify(val) : val?.toString() || '-'}
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

    // Modal Add Auditor
    const AddAuditorModal = () => {
        if (!showAddModal) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaUserTie /> Add New Auditor</h3>
                        <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddAuditor}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newAuditor.name}
                                    onChange={(e) => setNewAuditor({...newAuditor, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newAuditor.email}
                                    onChange={(e) => setNewAuditor({...newAuditor, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={newAuditor.phone}
                                    onChange={(e) => setNewAuditor({...newAuditor, phone: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialization</label>
                                <select
                                    value={newAuditor.specialization}
                                    onChange={(e) => setNewAuditor({...newAuditor, specialization: e.target.value})}
                                >
                                    <option value="General">General</option>
                                    <option value="Network Security">Network Security</option>
                                    <option value="Web Security">Web Security</option>
                                    <option value="Cloud Security">Cloud Security</option>
                                    <option value="Application Security">Application Security</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Experience</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 5 years"
                                    value={newAuditor.experience}
                                    onChange={(e) => setNewAuditor({...newAuditor, experience: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Education</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Master in Cybersecurity"
                                    value={newAuditor.education}
                                    onChange={(e) => setNewAuditor({...newAuditor, education: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Certifications (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., CISSP, CISA, CEH"
                                    value={newAuditor.certifications}
                                    onChange={(e) => setNewAuditor({...newAuditor, certifications: e.target.value})}
                                />
                            </div>
                            <div className="form-note">
                                <small>Default password: <strong>default123</strong> (user must change on first login)</small>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Add Auditor</button>
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
                    <p>Loading auditors...</p>
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
                        <h2><FaUserTie /> Auditors Management</h2>
                        <p>Manage security auditors and track their performance</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Add Auditor
                    </button>
                </div>

                {/* Stats Cards */}
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
                    <div className="stat-card clickable" onClick={() => {}}>
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

                {/* Table */}
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAuditors.map(a => (
                                <tr key={a.id} className="clickable-row" onClick={() => handleRowClick(a)}>
                                    <td><strong>{a.name}</strong></td>
                                    <td>{a.email}</td>
                                    <td>{a.specialization || 'General'}</td>
                                    <td>{a.assigned || 0}</td>
                                    <td>{a.completed || 0}</td>
                                    <td>{a.totalFindings || 0}</td>
                                    <td>
                                        <span className="rating-stars">
                                            {a.rating || 0} <FaStar className="star" />
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${a.status || 'active'}`}>
                                            {a.status || 'active'}
                                        </span>
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
                <AddAuditorModal />
            </div>
        </DashboardLayout>
    );
};

export default AdminAuditors;