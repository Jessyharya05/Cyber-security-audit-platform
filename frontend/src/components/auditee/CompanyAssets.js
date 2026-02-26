import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaServer, FaSearch, FaPlus, FaEdit, FaTrash, 
    FaEye, FaFilter, FaDatabase, FaCloud,
    FaNetworkWired, FaLaptop, FaTimes,
    FaArrowUp, FaArrowDown,FaCheckCircle
} from 'react-icons/fa';
import './Auditee.css';

const CompanyAssets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });

    // ========== DATA ASSETS ==========
    const [assets] = useState([
        { id: 1, name: 'Web Server', type: 'Server', owner: 'IT Dept', cia: 'High', criticality: 8.5, status: 'active' },
        { id: 2, name: 'Customer Database', type: 'Database', owner: 'IT Dept', cia: 'Critical', criticality: 9.2, status: 'active' },
        { id: 3, name: 'HR Application', type: 'Application', owner: 'HR Dept', cia: 'Medium', criticality: 6.8, status: 'active' },
        { id: 4, name: 'Firewall', type: 'Network', owner: 'IT Dept', cia: 'High', criticality: 8.0, status: 'active' },
        { id: 5, name: 'Employee Portal', type: 'Application', owner: 'IT Dept', cia: 'Medium', criticality: 7.2, status: 'inactive' },
        { id: 6, name: 'File Server', type: 'Server', owner: 'IT Dept', cia: 'Medium', criticality: 6.5, status: 'active' }
    ]);

    // ========== STATS ==========
    const stats = {
        total: assets.length,
        critical: assets.filter(a => a.cia === 'Critical').length,
        high: assets.filter(a => a.cia === 'High').length,
        active: assets.filter(a => a.status === 'active').length
    };

    // ========== FILTER ==========
    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             a.owner.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || a.type === filterType;
        return matchesSearch && matchesType;
    });

    // ========== HANDLE STAT CLICK ==========
    const handleStatClick = (type) => {
        let title = '';
        let items = [];

        switch(type) {
            case 'total':
                title = 'All Assets';
                items = assets;
                break;
            case 'critical':
                title = 'Critical Assets';
                items = assets.filter(a => a.cia === 'Critical');
                break;
            case 'high':
                title = 'High Value Assets';
                items = assets.filter(a => a.cia === 'High');
                break;
            case 'active':
                title = 'Active Assets';
                items = assets.filter(a => a.status === 'active');
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    // ========== HANDLE ROW CLICK ==========
    const handleRowClick = (asset) => {
        setModalData({
            show: true,
            title: 'Asset Details',
            items: [asset]
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

    // ========== GET CIA COLOR ==========
    const getCiaColor = (cia) => {
        switch(cia) {
            case 'Critical': return '#b91c1c';
            case 'High': return '#b45309';
            case 'Medium': return '#b68b40';
            default: return '#166534';
        }
    };

    // ========== GET ASSET ICON ==========
    const getAssetIcon = (type) => {
        switch(type) {
            case 'Server': return <FaServer />;
            case 'Database': return <FaDatabase />;
            case 'Network': return <FaNetworkWired />;
            default: return <FaLaptop />;
        }
    };

    return (
        <DashboardLayout role="auditee">
            <div className="auditee-page" style={{ padding: '24px' }}>
                {/* Header */}
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaServer /> Asset Inventory
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                            Manage your organization's assets
                        </p>
                    </div>
                    <button className="btn-primary" style={{ padding: '10px 20px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <FaPlus /> Add Asset
                    </button>
                </div>

                {/* STATS CARDS - SEMUA BISA DI KLIK */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon blue" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f0fe', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaServer />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.total}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Total Assets</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon red" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee8e8', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaServer />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.critical}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Critical Assets</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('high')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon orange" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff1e6', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaServer />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.high}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>High Value</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('active')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon green" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaCheckCircle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.active}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Active</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                        <FaSearch className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                    <div className="filter-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                        <FaFilter style={{ color: '#94a3b8' }} />
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{ border: 'none', padding: '10px', fontSize: '14px', outline: 'none', background: 'transparent' }}
                        >
                            <option value="all">All Types</option>
                            <option value="Server">Server</option>
                            <option value="Database">Database</option>
                            <option value="Application">Application</option>
                            <option value="Network">Network</option>
                        </select>
                    </div>
                </div>

                {/* Assets Table */}
                <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'auto' }}>
                    <table className="auditee-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Asset</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Owner</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>CIA</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Criticality</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="clickable-row" onClick={() => handleRowClick(asset)} style={{ cursor: 'pointer' }}>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getAssetIcon(asset.type)} {asset.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{asset.type}</td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{asset.owner}</td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: `${getCiaColor(asset.cia)}20`, color: getCiaColor(asset.cia) }}>
                                            {asset.cia}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{asset.criticality}</td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: asset.status === 'active' ? '#e6f7e6' : '#f1f5f9', color: asset.status === 'active' ? '#166534' : '#64748b' }}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
                                        <button className="icon-btn" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginRight: '8px' }}><FaEdit /></button>
                                        <button className="icon-btn" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                <DetailModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyAssets;