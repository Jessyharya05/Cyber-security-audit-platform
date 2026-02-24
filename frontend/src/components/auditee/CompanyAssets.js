// src/components/auditee/CompanyAssets.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaServer, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSearch,
  FaFilter,
  FaDatabase,
  FaCloud,
  FaNetworkWired,
  FaLaptop,
  FaShieldAlt
} from 'react-icons/fa';
import './Auditee.css';

const CompanyAssets = () => {
  const [assets, setAssets] = useState([
    { 
      id: 1, 
      name: 'Web Server', 
      owner: 'IT Department',
      location: 'AWS Cloud',
      type: 'Server',
      cia: 'High',
      criticality: 8.5,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Customer Database', 
      owner: 'IT Department',
      location: 'On-premise',
      type: 'Database',
      cia: 'Critical',
      criticality: 9.2,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'HR Application', 
      owner: 'HR Department',
      location: 'Cloud',
      type: 'Application',
      cia: 'Medium',
      criticality: 6.8,
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Firewall', 
      owner: 'IT Department',
      location: 'Network',
      type: 'Network Device',
      cia: 'High',
      criticality: 8.0,
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Employee Portal', 
      owner: 'IT Department',
      location: 'Cloud',
      type: 'Application',
      cia: 'Medium',
      criticality: 7.2,
      status: 'inactive'
    },
    { 
      id: 6, 
      name: 'File Server', 
      owner: 'IT Department',
      location: 'On-premise',
      type: 'Server',
      cia: 'Medium',
      criticality: 6.5,
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    name: '',
    owner: '',
    location: '',
    type: 'Server',
    cia: 'Medium'
  });

  const assetTypes = ['Server', 'Database', 'Application', 'Network Device', 'Workstation', 'Cloud Service'];
  const ciaValues = ['Low', 'Medium', 'High', 'Critical'];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const calculateCriticality = (cia) => {
    const values = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    const score = values[cia] * 2.5;
    return score.toFixed(1);
  };

  const handleAddAsset = () => {
    const assetToAdd = {
      id: assets.length + 1,
      ...newAsset,
      criticality: calculateCriticality(newAsset.cia),
      status: 'active'
    };
    setAssets([...assets, assetToAdd]);
    setShowAddModal(false);
    setNewAsset({ name: '', owner: '', location: '', type: 'Server', cia: 'Medium' });
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setNewAsset(asset);
    setShowAddModal(true);
  };

  const handleUpdateAsset = () => {
    setAssets(assets.map(a => a.id === editingAsset.id ? 
      { ...newAsset, id: editingAsset.id, criticality: calculateCriticality(newAsset.cia) } : a
    ));
    setShowAddModal(false);
    setEditingAsset(null);
    setNewAsset({ name: '', owner: '', location: '', type: 'Server', cia: 'Medium' });
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const getCiaColor = (cia) => {
    switch(cia) {
      case 'Critical': return '#b91c1c';
      case 'High': return '#b45309';
      case 'Medium': return '#b68b40';
      default: return '#166534';
    }
  };

  const getAssetIcon = (type) => {
    switch(type) {
      case 'Server': return <FaServer />;
      case 'Database': return <FaDatabase />;
      case 'Cloud Service': return <FaCloud />;
      case 'Network Device': return <FaNetworkWired />;
      default: return <FaLaptop />;
    }
  };

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
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaServer />
            </div>
            <div className="stat-content">
              <h3>{assets.length}</h3>
              <p>Total Assets</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3>{assets.filter(a => a.cia === 'Critical').length}</h3>
              <p>Critical Assets</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaShieldAlt />
            </div>
            <div className="stat-content">
              <h3>{assets.filter(a => a.cia === 'High').length}</h3>
              <p>High Value</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaServer />
            </div>
            <div className="stat-content">
              <h3>{assets.filter(a => a.status === 'active').length}</h3>
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
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {assetTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Assets Table */}
        <div className="table-container">
          <table className="auditee-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Location</th>
                <th>CIA</th>
                <th>Criticality</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td>
                    <div className="asset-name">
                      {getAssetIcon(asset.type)} {asset.name}
                    </div>
                  </td>
                  <td>{asset.type}</td>
                  <td>{asset.owner}</td>
                  <td>{asset.location}</td>
                  <td>
                    <span className="cia-badge" style={{
                      background: `${getCiaColor(asset.cia)}20`,
                      color: getCiaColor(asset.cia)
                    }}>
                      {asset.cia}
                    </span>
                  </td>
                  <td>
                    <div className="criticality-bar">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{
                          width: `${(asset.criticality / 10) * 100}%`,
                          background: getCiaColor(asset.cia)
                        }}></div>
                      </div>
                      <span>{asset.criticality}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${asset.status}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleEditAsset(asset)}><FaEdit /></button>
                    <button className="icon-btn" onClick={() => handleDeleteAsset(asset.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Asset Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                editingAsset ? handleUpdateAsset() : handleAddAsset();
              }}>
                <div className="form-group">
                  <label>Asset Name</label>
                  <input
                    type="text"
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    required
                    value={newAsset.owner}
                    onChange={(e) => setNewAsset({...newAsset, owner: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    required
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                    placeholder="e.g., AWS Cloud, On-premise"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Asset Type</label>
                    <select
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                    >
                      {assetTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>CIA Classification</label>
                    <select
                      value={newAsset.cia}
                      onChange={(e) => setNewAsset({...newAsset, cia: e.target.value})}
                    >
                      {ciaValues.map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingAsset ? 'Update Asset' : 'Add Asset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyAssets;