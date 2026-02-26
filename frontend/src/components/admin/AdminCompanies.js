import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaBuilding, FaSearch, FaPlus, FaEdit, FaTrash, 
    FaEye, FaDownload, FaFilter, FaCheckCircle,
    FaExclamationTriangle, FaTimesCircle, FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import './Admin.css';

const AdminCompanies = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Data companies
    const [companies] = useState([
        { id: 1, name: 'Tech Corp', email: 'admin@techcorp.com', sector: 'Technology', employees: 150, assets: 45, status: 'active', compliance: 82, exposure: 'Medium' },
        { id: 2, name: 'Finance Ltd', email: 'contact@finance.com', sector: 'Finance', employees: 80, assets: 23, status: 'active', compliance: 64, exposure: 'High' },
        { id: 3, name: 'HealthCare Inc', email: 'info@healthcare.com', sector: 'Healthcare', employees: 200, assets: 67, status: 'warning', compliance: 45, exposure: 'High' },
        { id: 4, name: 'EduGlobal', email: 'admin@eduglobal.com', sector: 'Education', employees: 45, assets: 34, status: 'active', compliance: 91, exposure: 'Low' },
        { id: 5, name: 'Retail Solutions', email: 'support@retail.com', sector: 'Retail', employees: 120, assets: 56, status: 'inactive', compliance: 38, exposure: 'Medium' },
        { id: 6, name: 'StartUp Tech', email: 'info@startup.com', sector: 'Technology', employees: 25, assets: 12, status: 'active', compliance: 95, exposure: 'Low' }
    ]);

    // Stats
    const stats = {
        total: companies.length,
        active: companies.filter(c => c.status === 'active').length,
        warning: companies.filter(c => c.status === 'warning').length,
        inactive: companies.filter(c => c.status === 'inactive').length
    };

    // Filter
    const filteredCompanies = companies.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterStatus === 'all' || c.status === filterStatus;
        return matchSearch && matchFilter;
    });

    // Handle klik stats
    const handleStatClick = (status) => {
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
    };

    // Handle klik baris
    const handleRowClick = (company) => {
        setSelectedCompany(company);
        setShowDetail(true);
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
                        <div className="detail-row">
                            <label>Email:</label> {selectedCompany.email}
                        </div>
                        <div className="detail-row">
                            <label>Sector:</label> {selectedCompany.sector}
                        </div>
                        <div className="detail-row">
                            <label>Employees:</label> {selectedCompany.employees}
                        </div>
                        <div className="detail-row">
                            <label>Assets:</label> {selectedCompany.assets}
                        </div>
                        <div className="detail-row">
                            <label>Status:</label> 
                            <span className={`status-badge ${selectedCompany.status}`}>
                                {selectedCompany.status}
                            </span>
                        </div>
                        <div className="detail-row">
                            <label>Compliance:</label> {selectedCompany.compliance}%
                        </div>
                        <div className="detail-row">
                            <label>Exposure:</label> 
                            <span className={`exposure-badge ${selectedCompany.exposure.toLowerCase()}`}>
                                {selectedCompany.exposure}
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
                        <button className="close-btn" onClick={() => setModalData({...modalData, show: false})}>×</button>
                    </div>
                    <div className="modal-body">
                        <table className="detail-table">
                            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Compliance</th></tr></thead>
                            <tbody>
                                {modalData.items.map(c => (
                                    <tr key={c.id} onClick={() => { setModalData({...modalData, show: false}); handleRowClick(c); }}>
                                        <td>#{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                                        <td>{c.compliance}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout role="admin">
            <div className="admin-page">
                <div className="page-header">
                    <h2><FaBuilding /> Companies Management</h2>
                    <button className="btn-primary"><FaPlus /> Add Company</button>
                </div>

                {/* Stats Cards - BISA DI KLIK */}
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

                {/* Search */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input placeholder="Search companies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Sector</th><th>Status</th><th>Compliance</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filteredCompanies.map(c => (
                                <tr key={c.id} className="clickable-row" onClick={() => handleRowClick(c)}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.sector}</td>
                                    <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                                    <td>{c.compliance}%</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button className="icon-btn"><FaEdit /></button>
                                        <button className="icon-btn"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <StatsModal />
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default AdminCompanies;