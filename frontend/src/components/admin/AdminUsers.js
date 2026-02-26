// ============================================
// src/components/admin/AdminUsers.js
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaUsers, FaUserTie, FaUserCheck, FaSearch,
    FaEdit, FaTrash, FaCheckCircle, FaTimes
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const AdminUsers = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/');
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = {
        total: users.length,
        auditors: users.filter(u => u.role === 'auditor').length,
        auditees: users.filter(u => u.role === 'auditee').length,
        active: users.filter(u => u.status === 'active').length
    };

    // Filter
    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle klik stats
    const handleStatClick = async (type) => {
        try {
            let title = '';
            let items = [];
            
            if (type === 'total') {
                title = 'All Users';
                items = users;
            } else if (type === 'auditors') {
                title = 'Auditors';
                items = users.filter(u => u.role === 'auditor');
            } else if (type === 'auditees') {
                title = 'Auditees';
                items = users.filter(u => u.role === 'auditee');
            } else if (type === 'active') {
                title = 'Active Users';
                items = users.filter(u => u.status === 'active');
            }
            
            setModalData({ show: true, title, items });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle klik baris
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowDetail(true);
    };

    // Handle delete
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                alert('User deleted successfully!');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    // Handle edit
    const handleEdit = (user, e) => {
        e.stopPropagation();
        alert(`Edit user: ${user.name} (Demo mode)`);
    };

    // Modal Detail
    const DetailModal = () => {
        if (!showDetail || !selectedUser) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowDetail(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaUsers /> {selectedUser.name}</h3>
                        <button className="close-btn" onClick={() => setShowDetail(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="detail-row"><label>Email:</label> {selectedUser.email}</div>
                        <div className="detail-row"><label>Role:</label> {selectedUser.role}</div>
                        <div className="detail-row"><label>Company:</label> {selectedUser.company || '-'}</div>
                        <div className="detail-row"><label>Status:</label> 
                            <span className={`status-badge ${selectedUser.status || 'active'}`}>
                                {selectedUser.status || 'active'}
                            </span>
                        </div>
                        <div className="detail-row"><label>Last Login:</label> {selectedUser.lastLogin || '-'}</div>
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
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map(u => (
                                        <tr key={u.id} onClick={() => { 
                                            setModalData({...modalData, show: false}); 
                                            handleRowClick(u); 
                                        }} className="clickable-row">
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>
                                            <td>
                                                <span className={`status-badge ${u.status || 'active'}`}>
                                                    {u.status || 'active'}
                                                </span>
                                            </td>
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
            <DashboardLayout role="admin">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
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
                        <h2><FaUsers /> Users Management</h2>
                        <p>Manage all users across the platform</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon blue"><FaUsers /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Users</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('auditors')}>
                        <div className="stat-icon purple"><FaUserTie /></div>
                        <h3>{stats.auditors}</h3>
                        <p>Auditors</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('auditees')}>
                        <div className="stat-icon green"><FaUserCheck /></div>
                        <h3>{stats.auditees}</h3>
                        <p>Auditees</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('active')}>
                        <div className="stat-icon teal"><FaCheckCircle /></div>
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                </div>

                {/* Search */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input 
                        placeholder="Search users by name or email..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="clickable-row" onClick={() => handleRowClick(u)}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.company || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${u.status || 'active'}`}>
                                            {u.status || 'active'}
                                        </span>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button className="icon-btn" onClick={(e) => handleEdit(u, e)} title="Edit">
                                            <FaEdit />
                                        </button>
                                        <button className="icon-btn" onClick={(e) => handleDelete(u.id, e)} title="Delete">
                                            <FaTrash />
                                        </button>
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

export default AdminUsers;