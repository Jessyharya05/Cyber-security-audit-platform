// src/components/admin/AdminUsers.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaUsers, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaUserTie,
  FaUserCheck,
  FaFilter,
  FaSort,
  FaKey,
  FaBan
} from 'react-icons/fa';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@techcorp.com', role: 'auditee', company: 'Tech Corp', status: 'active', lastLogin: '2024-02-20' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@finance.com', role: 'auditee', company: 'Finance Ltd', status: 'active', lastLogin: '2024-02-19' },
    { id: 3, name: 'Michael Chen', email: 'michael@cyber.com', role: 'auditor', company: 'CyberGuard', status: 'active', lastLogin: '2024-02-21' },
    { id: 4, name: 'Emily Davis', email: 'emily@healthcare.com', role: 'auditee', company: 'HealthCare Inc', status: 'inactive', lastLogin: '2024-02-01' },
    { id: 5, name: 'Dr. Robert Wilson', email: 'robert@cyber.com', role: 'auditor', company: 'CyberGuard', status: 'active', lastLogin: '2024-02-20' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa@cyber.com', role: 'auditor', company: 'CyberGuard', status: 'active', lastLogin: '2024-02-21' },
    { id: 7, name: 'David Brown', email: 'david@retail.com', role: 'auditee', company: 'Retail Solutions', status: 'active', lastLogin: '2024-02-18' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'auditee',
    company: '',
    password: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleAddUser = () => {
    const newId = users.length + 1;
    const userToAdd = {
      id: newId,
      ...newUser,
      status: 'active',
      lastLogin: '-'
    };
    setUsers([...users, userToAdd]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'auditee', company: '', password: '' });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleResetPassword = (email) => {
    alert(`Password reset link sent to ${email}`);
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? {...user, status: user.status === 'active' ? 'inactive' : 'active'}
        : user
    ));
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaUsers /> Users Management</h2>
            <p>Manage all users across the platform</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <FaPlus /> Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaUserTie />
            </div>
            <div className="stat-content">
              <h3>{users.filter(u => u.role === 'auditor').length}</h3>
              <p>Auditors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaUserCheck />
            </div>
            <div className="stat-content">
              <h3>{users.filter(u => u.role === 'auditee').length}</h3>
              <p>Auditees</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{users.filter(u => u.status === 'active').length}</h3>
              <p>Active</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="auditor">Auditor</option>
              <option value="auditee">Auditee</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name <FaSort className="sort-icon" /></th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'auditor' ? <FaUserTie /> : <FaUserCheck />}
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td>{user.company}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <button className="icon-btn" title="View"><FaEye /></button>
                    <button className="icon-btn" title="Edit"><FaEdit /></button>
                    <button className="icon-btn" title="Reset Password" onClick={() => handleResetPassword(user.email)}><FaKey /></button>
                    <button className="icon-btn" title="Toggle Status" onClick={() => handleToggleStatus(user.id)}><FaBan /></button>
                    <button className="icon-btn" title="Delete" onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New User</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="auditee">Auditee (Company)</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    required
                    value={newUser.company}
                    onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Add User</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;