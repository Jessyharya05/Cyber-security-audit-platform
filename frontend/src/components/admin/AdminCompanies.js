// ============================================
// src/components/admin/AdminCompanies.js
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaBuilding, FaSearch, FaEdit, FaTrash, 
    FaEye, FaCheckCircle, FaExclamationTriangle, 
    FaTimesCircle, FaArrowUp, FaArrowDown,
    FaPlus, FaTimes
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const AdminCompanies = () => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        email: '',
        sector: 'Technology',
        employees: 0,
        phone: '',
        address: '',
        systemType: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            console.log('Fetching companies...');
            const response = await api.get('/companies/');
            console.log('Raw response:', response);
            console.log('Companies data:', response.data);
            
            const companiesData = response.data || [];
            
            // Mapping data dari database
            const mappedCompanies = companiesData.map(c => ({
                id: c.id,
                name: c.name,
                email: c.user?.email || c.email || '-',
                sector: c.sector || 'Technology',
                employees: c.employees || 0,
                status: c.status || 'active',
                compliance: Math.floor(Math.random() * 30) + 60,
                exposureLevel: c.exposure_level || 'Medium',
                phone: c.phone || '-',
                address: c.address || '-',
                systemType: c.system_type || '-'
            }));
            
            console.log('Mapped companies:', mappedCompanies);
            setCompanies(mappedCompanies);
        } catch (error) {
            console.error('Error fetching companies:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
        } finally {
            setLoading(false);
        }
    };

    // Stats
    // Stats
const stats = {
    total: companies.length,
    active: companies.filter(c => c.status === 'active').length,
    warning: companies.filter(c => c.status === 'warning').length,
    inactive: companies.filter(c => c.status === 'inactive').length
};

    // Filter
    const filteredCompanies = companies.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterStatus === 'all' || c.status === filterStatus;
        return matchSearch && matchFilter;
    });

    // Handle klik stats
    const handleStatClick = async (status) => {
        try {
            let title = '';
            let items = [];
            
            if (status === 'total') {
                title = 'All Companies';
                items = companies;
            } else {
                title = `${status.charAt(0).toUpperCase() + status.slice(1)} Companies`;
                items = companies.filter(c => c.status === status);
            }
            
            setModalData({ show: true, title, items });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle klik baris
    const handleRowClick = (company) => {
        setSelectedCompany(company);
        setShowDetail(true);
    };

    // Handle delete
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await api.delete(`/companies/${id}`);
                fetchCompanies(); // Refresh data
                alert('Company deleted successfully!');
            } catch (error) {
                console.error('Error deleting company:', error);
                alert('Failed to delete company');
            }
        }
    };

    // Handle edit
    const handleEdit = (company, e) => {
        e.stopPropagation();
        alert(`Edit company: ${company.name} (Demo mode)`);
    };

    // Handle add company
    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/companies/', newCompany);
            if (response.data) {
                fetchCompanies();
                setShowAddModal(false);
                setNewCompany({
                    name: '',
                    email: '',
                    sector: 'Technology',
                    employees: 0,
                    phone: '',
                    address: '',
                    systemType: ''
                });
                alert('Company added successfully!');
            }
        } catch (error) {
            console.error('Error adding company:', error);
            alert('Failed to add company');
        }
    };

    // Modal Detail
    const DetailModal = () => {
        if (!showDetail || !selectedCompany) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowDetail(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaBuilding /> {selectedCompany.name}</h3>
                        <button className="close-btn" onClick={() => setShowDetail(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="detail-row"><label>Email:</label> {selectedCompany.email}</div>
                        <div className="detail-row"><label>Sector:</label> {selectedCompany.sector}</div>
                        <div className="detail-row"><label>Employees:</label> {selectedCompany.employees}</div>
                        <div className="detail-row"><label>Phone:</label> {selectedCompany.phone || '-'}</div>
                        <div className="detail-row"><label>Address:</label> {selectedCompany.address || '-'}</div>
                        <div className="detail-row"><label>System Type:</label> {selectedCompany.systemType || '-'}</div>
                        <div className="detail-row"><label>Status:</label> 
                            <span className={`status-badge ${selectedCompany.status || 'active'}`}>
                                {selectedCompany.status || 'active'}
                            </span>
                        </div>
                        <div className="detail-row"><label>Compliance:</label> {selectedCompany.compliance || 0}%</div>
                        <div className="detail-row"><label>Exposure:</label> 
                            <span className={`exposure-badge ${(selectedCompany.exposureLevel || 'medium').toLowerCase()}`}>
                                {selectedCompany.exposureLevel || 'Medium'}
                            </span>
                        </div>
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
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Sector</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.items.map(c => (
                                        <tr key={c.id} onClick={() => { 
                                            setModalData({...modalData, show: false}); 
                                            handleRowClick(c); 
                                        }} className="clickable-row">
                                            <td>#{c.id}</td>
                                            <td>{c.name}</td>
                                            <td>{c.email}</td>
                                            <td>{c.sector}</td>
                                            <td>
                                                <span className={`status-badge ${c.status || 'active'}`}>
                                                    {c.status || 'active'}
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

    // Modal Add Company
    const AddCompanyModal = () => {
        if (!showAddModal) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaBuilding /> Add New Company</h3>
                        <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddCompany}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newCompany.email}
                                    onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sector</label>
                                    <select
                                        value={newCompany.sector}
                                        onChange={(e) => setNewCompany({...newCompany, sector: e.target.value})}
                                    >
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Retail">Retail</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Employees</label>
                                    <input
                                        type="number"
                                        value={newCompany.employees}
                                        onChange={(e) => setNewCompany({...newCompany, employees: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={newCompany.phone}
                                    onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    value={newCompany.address}
                                    onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>System Type</label>
                                <input
                                    type="text"
                                    value={newCompany.systemType}
                                    onChange={(e) => setNewCompany({...newCompany, systemType: e.target.value})}
                                    placeholder="e.g., Web Application, Cloud Services"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Add Company</button>
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
                    <p>Loading companies...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="admin-page">
                <div className="page-header">
                    <div>
                        <h2><FaBuilding /> Companies Management</h2>
                        <p>Manage all registered companies</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Add Company
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon blue"><FaBuilding /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Companies</p>
                        <span className="stat-trend up"><FaArrowUp /> +2</span>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('active')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('warning')}>
                        <div className="stat-icon orange"><FaExclamationTriangle /></div>
                        <h3>{stats.warning}</h3>
                        <p>Warning</p>
                    </div>
                    <div className="stat-card clickable" onClick={() => handleStatClick('inactive')}>
                        <div className="stat-icon red"><FaTimesCircle /></div>
                        <h3>{stats.inactive}</h3>
                        <p>Inactive</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input 
                            placeholder="Search companies..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="filter-box">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="warning">Warning</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Sector</th>
                                <th>Employees</th>
                                <th>Status</th>
                                <th>Compliance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map(c => (
                                <tr key={c.id} className="clickable-row" onClick={() => handleRowClick(c)}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.email}</td>
                                    <td>{c.sector}</td>
                                    <td>{c.employees}</td>
                                    <td>
                                        <span className={`status-badge ${c.status || 'active'}`}>
                                            {c.status || 'active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="progress-cell">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{width: `${c.compliance || 70}%`}}></div>
                                            </div>
                                            <span>{c.compliance || 70}%</span>
                                        </div>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button className="icon-btn" onClick={(e) => handleEdit(c, e)} title="Edit"><FaEdit /></button>
                                        <button className="icon-btn" onClick={(e) => handleDelete(c.id, e)} title="Delete"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODALS */}
                <StatsModal />
                <DetailModal />
                <AddCompanyModal />
            </div>
        </DashboardLayout>
    );
};

export default AdminCompanies;