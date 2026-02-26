// src/components/auditee/CompanyAssets.js
import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaServer, FaSearch, FaPlus, FaEdit, FaTrash, 
    FaEye, FaFilter, FaDatabase, FaCloud,
    FaNetworkWired, FaLaptop, FaTimes,
    FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditee.css';

const CompanyAssets = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [assets, setAssets] = useState([]);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [modalData, setModalData] = useState({ show: false, title: '', items: [] });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const companyId = user?.companyId || 1;
            const response = await api.get(`/assets/company/${companyId}`);
            setAssets(response.data || []);
            console.log('Assets loaded:', response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Stats
    const stats = {
        total: assets.length,
        critical: assets.filter(a => a.cia === 'Critical').length,
        high: assets.filter(a => a.cia === 'High').length,
        active: assets.filter(a => a.status === 'active').length
    };

    // Filter
    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             a.owner?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || a.type === filterType;
        return matchesSearch && matchesType;
    });

    // Handle stat click
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

    // Handle row click
    const handleRowClick = (asset) => {
        setModalData({ show: true, title: 'Asset Details', items: [asset] });
    };

    // Handle edit click
    const handleEditClick = (asset, e) => {
        e.stopPropagation();
        setSelectedAsset(asset);
        setShowEditModal(true);
    };

    // Handle delete
    // src/components/auditee/CompanyAssets.js

// ===== PERBAIKI HANDLE DELETE =====
const handleDelete = async (id, e) => {
    e.stopPropagation();
    
    // Konfirmasi dulu
    if (!window.confirm('Are you sure you want to delete this asset?')) {
        return;
    }

    try {
        console.log('Deleting asset with ID:', id);
        
        // Panggil API DELETE
        const response = await api.delete(`/assets/${id}`);
        
        console.log('Delete response:', response);
        
        // Kalau sukses (status 200, 201, 204)
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            await fetchAssets(); // Refresh data
            alert('✅ Asset deleted successfully!');
        } else {
            throw new Error('Unexpected response status');
        }
        
    } catch (error) {
        console.error('Error deleting asset:', error);
        
        // Tampilkan pesan error yang lebih informatif
        if (error.response) {
            // Error dari server (4xx, 5xx)
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 401) {
                alert('❌ Unauthorized. Please login again.');
            } else if (status === 403) {
                alert('❌ You do not have permission to delete this asset.');
            } else if (status === 404) {
                alert('❌ Asset not found. It may have been already deleted.');
            } else {
                alert(`❌ Failed to delete asset: ${data?.detail || data?.message || 'Unknown error'}`);
            }
        } else if (error.request) {
            // No response from server
            alert('❌ Cannot connect to server. Please check your connection.');
        } else {
            // Other errors
            alert('❌ Failed to delete asset. Please try again.');
        }
    }
};
    // Handle edit submit
    const handleEditAsset = async (id, assetData) => {
        try {
            const response = await api.put(`/assets/${id}`, assetData);
            if (response.data) {
                await fetchAssets();
                setShowEditModal(false);
                setSelectedAsset(null);
                alert('Asset updated successfully!');
            }
        } catch (error) {
            console.error('Error updating asset:', error);
            alert('Failed to update asset');
        }
    };

    // Get CIA color
    const getCiaColor = (cia) => {
        switch(cia) {
            case 'Critical': return '#b91c1c';
            case 'High': return '#b45309';
            case 'Medium': return '#b68b40';
            default: return '#166534';
        }
    };

    // Get asset icon
    const getAssetIcon = (type) => {
        switch(type?.toLowerCase()) {
            case 'server': return <FaServer />;
            case 'database': return <FaDatabase />;
            case 'network': return <FaNetworkWired />;
            default: return <FaLaptop />;
        }
    };

    // ========== MODAL COMPONENTS ==========

    // Detail Modal
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
                                                <td key={i}>{val?.toString() || '-'}</td>
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

    // Add Asset Modal
    const AddAssetModal = () => {
        const [formName, setFormName] = useState('');
        const [formType, setFormType] = useState('Server');
        const [formOwner, setFormOwner] = useState('');
        const [formCia, setFormCia] = useState('Medium');
        const [formLocation, setFormLocation] = useState('on-premise');

        const resetForm = () => {
            setFormName('');
            setFormType('Server');
            setFormOwner('');
            setFormCia('Medium');
            setFormLocation('on-premise');
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const companyId = user?.companyId || 1;
                const response = await api.post('/assets/', {
                    name: formName,
                    type: formType,
                    owner: formOwner,
                    cia: formCia,
                    location: formLocation,
                    company_id: companyId
                });
                
                if (response.data) {
                    await fetchAssets();
                    setShowAddModal(false);
                    resetForm();
                    alert('Asset added successfully!');
                }
            } catch (error) {
                console.error('Error adding asset:', error);
                alert('Failed to add asset');
            }
        };

        const handleClose = () => {
            resetForm();
            setShowAddModal(false);
        };

        const handleOverlayClick = (e) => {
            if (e.target === e.currentTarget) {
                handleClose();
            }
        };

        if (!showAddModal) return null;

        return (
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaPlus /> Add New Asset</h3>
                        <button className="close-btn" onClick={handleClose} type="button">
                            <FaTimes />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Asset Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g., Production Database"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    required
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                >
                                    <option value="Server">Server</option>
                                    <option value="Database">Database</option>
                                    <option value="Application">Application</option>
                                    <option value="Network">Network</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Owner</label>
                                <input
                                    type="text"
                                    value={formOwner}
                                    onChange={(e) => setFormOwner(e.target.value)}
                                    placeholder="e.g., IT Department"
                                />
                            </div>

                            <div className="form-group">
                                <label>CIA Value *</label>
                                <select
                                    required
                                    value={formCia}
                                    onChange={(e) => setFormCia(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <select
                                    value={formLocation}
                                    onChange={(e) => setFormLocation(e.target.value)}
                                >
                                    <option value="cloud">Cloud</option>
                                    <option value="on-premise">On-Premise</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                <FaPlus /> Add Asset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Edit Asset Modal
    const EditAssetModal = () => {
        const [formName, setFormName] = useState('');
        const [formType, setFormType] = useState('Server');
        const [formOwner, setFormOwner] = useState('');
        const [formCia, setFormCia] = useState('Medium');
        const [formLocation, setFormLocation] = useState('on-premise');

        useEffect(() => {
            if (selectedAsset) {
                setFormName(selectedAsset.name || '');
                setFormType(selectedAsset.type || 'Server');
                setFormOwner(selectedAsset.owner || '');
                setFormCia(selectedAsset.cia || 'Medium');
                setFormLocation(selectedAsset.location || 'on-premise');
            }
        }, [selectedAsset]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleEditAsset(selectedAsset.id, {
                name: formName,
                type: formType,
                owner: formOwner,
                cia: formCia,
                location: formLocation
            });
        };

        const handleClose = () => {
            setShowEditModal(false);
            setSelectedAsset(null);
        };

        const handleOverlayClick = (e) => {
            if (e.target === e.currentTarget) {
                handleClose();
            }
        };

        if (!showEditModal || !selectedAsset) return null;

        return (
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaEdit /> Edit Asset</h3>
                        <button className="close-btn" onClick={handleClose} type="button">
                            <FaTimes />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Asset Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g., Production Database"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    required
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                >
                                    <option value="Server">Server</option>
                                    <option value="Database">Database</option>
                                    <option value="Application">Application</option>
                                    <option value="Network">Network</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Owner</label>
                                <input
                                    type="text"
                                    value={formOwner}
                                    onChange={(e) => setFormOwner(e.target.value)}
                                    placeholder="e.g., IT Department"
                                />
                            </div>

                            <div className="form-group">
                                <label>CIA Value *</label>
                                <select
                                    required
                                    value={formCia}
                                    onChange={(e) => setFormCia(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <select
                                    value={formLocation}
                                    onChange={(e) => setFormLocation(e.target.value)}
                                >
                                    <option value="cloud">Cloud</option>
                                    <option value="on-premise">On-Premise</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                <FaEdit /> Update Asset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout role="auditee">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading assets...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="auditee">
            <div className="auditee-page">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h2><FaServer /> Asset Inventory</h2>
                        <p>Manage your organization's assets</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Add Asset
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon blue"><FaServer /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Assets</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('critical')}>
                        <div className="stat-icon red"><FaServer /></div>
                        <h3>{stats.critical}</h3>
                        <p>Critical Assets</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('high')}>
                        <div className="stat-icon orange"><FaServer /></div>
                        <h3>{stats.high}</h3>
                        <p>High Value</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('active')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.active}</h3>
                        <p>Active</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="Server">Server</option>
                            <option value="Database">Database</option>
                            <option value="Application">Application</option>
                            <option value="Network">Network</option>
                        </select>
                    </div>
                </div>

                {/* Assets Table */}
                <div className="table-container">
                    <table className="auditee-table">
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Type</th>
                                <th>Owner</th>
                                <th>CIA</th>
                                <th>Criticality</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="clickable-row" onClick={() => handleRowClick(asset)}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getAssetIcon(asset.type)} {asset.name}
                                        </div>
                                    </td>
                                    <td>{asset.type}</td>
                                    <td>{asset.owner || '-'}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '12px', 
                                            fontSize: '11px', 
                                            background: `${getCiaColor(asset.cia)}20`, 
                                            color: getCiaColor(asset.cia) 
                                        }}>
                                            {asset.cia}
                                        </span>
                                    </td>
                                    <td>{asset.criticality || 'N/A'}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '12px', 
                                            fontSize: '11px', 
                                            background: asset.status === 'active' ? '#e6f7e6' : '#f1f5f9', 
                                            color: asset.status === 'active' ? '#166534' : '#64748b' 
                                        }}>
                                            {asset.status || 'active'}
                                        </span>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            className="icon-btn" 
                                            onClick={(e) => handleEditClick(asset, e)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="icon-btn" 
                                            onClick={(e) => handleDelete(asset.id, e)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                <DetailModal />
                <AddAssetModal />
                <EditAssetModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyAssets;