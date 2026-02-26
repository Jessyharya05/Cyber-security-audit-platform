import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaUpload, FaSearch, FaFilter, FaDownload,
    FaEye, FaTimes, FaCheckCircle, FaClock,
    FaExclamationTriangle, FaFilePdf, FaFileImage,
    FaCloudUploadAlt, FaFileAlt, FaPlus
} from 'react-icons/fa';
import './Auditee.css';

const CompanyEvidence = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalData, setModalData] = useState({
        show: false,
        title: '',
        items: []
    });
    const [uploadModal, setUploadModal] = useState({
        show: false,
        item: null
    });
    const [addModal, setAddModal] = useState({
        show: false
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [newEvidence, setNewEvidence] = useState({
        control: '',
        asset: '',
        dueDate: '',
        priority: 'medium'
    });

    // ========== DATA EVIDENCE ==========
    const [evidence, setEvidence] = useState([
        { id: 1, control: 'Password Policy', asset: 'HR System', dueDate: '2024-03-01', status: 'pending', priority: 'high' },
        { id: 2, control: 'Backup Procedure', asset: 'Database', dueDate: '2024-03-03', status: 'uploaded', priority: 'critical' },
        { id: 3, control: 'Access Control List', asset: 'File Server', dueDate: '2024-02-28', status: 'overdue', priority: 'high' },
        { id: 4, control: 'Firewall Configuration', asset: 'Network', dueDate: '2024-03-05', status: 'pending', priority: 'medium' },
        { id: 5, control: 'Incident Response Plan', asset: 'All Systems', dueDate: '2024-03-07', status: 'pending', priority: 'medium' },
        { id: 6, control: 'Encryption Policy', asset: 'Database', dueDate: '2024-03-02', status: 'uploaded', priority: 'high' }
    ]);

    // ========== STATS ==========
    const stats = {
        total: evidence.length,
        uploaded: evidence.filter(e => e.status === 'uploaded').length,
        pending: evidence.filter(e => e.status === 'pending').length,
        overdue: evidence.filter(e => e.status === 'overdue').length
    };

    // ========== FILTER ==========
    const filteredEvidence = evidence.filter(e => {
        const matchesSearch = e.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             e.asset.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // ========== HANDLE STAT CLICK ==========
    const handleStatClick = (type) => {
        let title = '';
        let items = [];

        switch(type) {
            case 'total':
                title = 'All Required Evidence';
                items = evidence;
                break;
            case 'uploaded':
                title = 'Uploaded Evidence';
                items = evidence.filter(e => e.status === 'uploaded');
                break;
            case 'pending':
                title = 'Pending Evidence';
                items = evidence.filter(e => e.status === 'pending');
                break;
            case 'overdue':
                title = 'Overdue Evidence';
                items = evidence.filter(e => e.status === 'overdue');
                break;
            default:
                return;
        }

        setModalData({ show: true, title, items });
    };

    // ========== HANDLE ROW CLICK ==========
    const handleRowClick = (item) => {
        setModalData({
            show: true,
            title: 'Evidence Details',
            items: [item]
        });
    };

    // ========== HANDLE UPLOAD CLICK ==========
    const handleUploadClick = (item, e) => {
        e.stopPropagation();
        setUploadModal({
            show: true,
            item: item
        });
        setSelectedFile(null);
        setUploadProgress(0);
    };

    // ========== HANDLE ADD CLICK ==========
    const handleAddClick = () => {
        setAddModal({ show: true });
        setNewEvidence({
            control: '',
            asset: '',
            dueDate: '',
            priority: 'medium'
        });
    };

    // ========== HANDLE ADD SUBMIT ==========
    const handleAddSubmit = (e) => {
        e.preventDefault();
        
        // Validasi
        if (!newEvidence.control || !newEvidence.asset || !newEvidence.dueDate) {
            alert('Please fill all required fields');
            return;
        }

        // Buat ID baru
        const newId = Math.max(...evidence.map(e => e.id)) + 1;
        
        // Tambah evidence baru
        const evidenceToAdd = {
            id: newId,
            ...newEvidence,
            status: 'pending'
        };

        setEvidence([...evidence, evidenceToAdd]);
        setAddModal({ show: false });
        alert(`✅ Evidence "${newEvidence.control}" added successfully!`);
    };

    // ========== HANDLE DELETE ==========
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this evidence requirement?')) {
            setEvidence(evidence.filter(e => e.id !== id));
        }
    };

    // ========== HANDLE FILE SELECT ==========
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('File type not allowed. Please upload PDF, JPEG, or PNG.');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert('File too large. Maximum size is 10MB.');
                return;
            }
            
            setSelectedFile(file);
        }
    };

    // ========== HANDLE UPLOAD SUBMIT ==========
    const handleUploadSubmit = () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        setIsUploading(true);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                
                setTimeout(() => {
                    const updatedEvidence = evidence.map(item => 
                        item.id === uploadModal.item.id 
                            ? { ...item, status: 'uploaded' } 
                            : item
                    );
                    setEvidence(updatedEvidence);
                    
                    setIsUploading(false);
                    setUploadModal({ show: false, item: null });
                    alert(`✅ File "${selectedFile.name}" uploaded successfully!`);
                }, 500);
            }
        }, 200);
    };

    // ========== HANDLE DOWNLOAD ==========
    const handleDownload = (item, e) => {
        e.stopPropagation();
        alert(`📥 Downloading evidence for "${item.control}" (Demo mode)`);
    };

    // ========== MODAL ADD EVIDENCE ==========
    const AddEvidenceModal = () => {
        if (!addModal.show) return null;

        return (
            <div className="modal-overlay" onClick={() => setAddModal({ show: false })}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaPlus /> Add New Evidence Requirement</h3>
                        <button className="close-btn" onClick={() => setAddModal({ show: false })}>
                            <FaTimes />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Control / Requirement *</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvidence.control}
                                    onChange={(e) => setNewEvidence({...newEvidence, control: e.target.value})}
                                    placeholder="e.g., Password Policy, Firewall Rules"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Asset *</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvidence.asset}
                                    onChange={(e) => setNewEvidence({...newEvidence, asset: e.target.value})}
                                    placeholder="e.g., Web Server, Database"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Due Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvidence.dueDate}
                                        onChange={(e) => setNewEvidence({...newEvidence, dueDate: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={newEvidence.priority}
                                        onChange={(e) => setNewEvidence({...newEvidence, priority: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '20px', borderTop: '1px solid #eef2f6' }}>
                            <button 
                                type="button"
                                className="btn-secondary"
                                onClick={() => setAddModal({ show: false })}
                                style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="btn-primary"
                                style={{ padding: '10px 20px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                <FaPlus /> Add Evidence
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // ========== MODAL DETAIL ==========
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

    // ========== MODAL UPLOAD ==========
    const UploadModal = () => {
        if (!uploadModal.show || !uploadModal.item) return null;

        const item = uploadModal.item;

        return (
            <div className="modal-overlay" onClick={() => setUploadModal({ show: false, item: null })}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3><FaUpload /> Upload Evidence</h3>
                        <button className="close-btn" onClick={() => setUploadModal({ show: false, item: null })}>
                            <FaTimes />
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Control: {item.control}</h4>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Asset: {item.asset}</p>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Due Date: {item.dueDate}</p>
                        </div>

                        <div 
                            style={{ 
                                border: '2px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '30px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: selectedFile ? '#f8fafc' : 'white',
                                marginBottom: '20px'
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input 
                                type="file" 
                                id="fileInput" 
                                style={{ display: 'none' }} 
                                onChange={handleFileSelect}
                                disabled={isUploading}
                            />
                            {selectedFile ? (
                                <>
                                    <FaFileAlt size={40} style={{ color: '#1e293b', marginBottom: '10px' }} />
                                    <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{selectedFile.name}</p>
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                                        {(selectedFile.size / 1024).toFixed(0)} KB
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaCloudUploadAlt size={40} style={{ color: '#94a3b8', marginBottom: '10px' }} />
                                    <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>Click to select file</p>
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                                        Supported: PDF, JPEG, PNG (Max 10MB)
                                    </p>
                                </>
                            )}
                        </div>

                        {isUploading && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Uploading...</span>
                                    <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>{uploadProgress}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#1e293b', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                className="btn-secondary"
                                onClick={() => setUploadModal({ show: false, item: null })}
                                style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', cursor: 'pointer' }}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleUploadSubmit}
                                style={{ 
                                    padding: '10px 20px', 
                                    background: '#1e293b', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    opacity: isUploading ? 0.5 : 1
                                }}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Evidence'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========== GET STATUS COLOR ==========
    const getStatusColor = (status) => {
        switch(status) {
            case 'uploaded': return { bg: '#e6f7e6', color: '#166534' };
            case 'pending': return { bg: '#f1f5f9', color: '#64748b' };
            case 'overdue': return { bg: '#fee8e8', color: '#b91c1c' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <DashboardLayout role="auditee">
            <div className="auditee-page" style={{ padding: '24px' }}>
                {/* Header dengan tombol Add Evidence */}
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaUpload /> Evidence Collection
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                            Upload required evidence for audit controls
                        </p>
                    </div>
                    <button 
                        className="btn-primary" 
                        onClick={handleAddClick}
                        style={{ 
                            padding: '10px 20px', 
                            background: '#1e293b', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        <FaPlus /> Add Evidence
                    </button>
                </div>

                {/* STATS CARDS - SEMUA BISA DI KLIK */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon blue" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f0fe', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaUpload />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.total}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Total Required</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('uploaded')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon green" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e6f7e6', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaCheckCircle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.uploaded}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Uploaded</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('pending')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon orange" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff1e6', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaClock />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.pending}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Pending</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('overdue')} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef2f6', position: 'relative', cursor: 'pointer' }}>
                        <div className="stat-icon red" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee8e8', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{stats.overdue}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Overdue</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                        <FaSearch className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text"
                            placeholder="Search evidence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                    <div className="filter-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                        <FaFilter style={{ color: '#94a3b8' }} />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ border: 'none', padding: '10px', fontSize: '14px', outline: 'none', background: 'transparent' }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="uploaded">Uploaded</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Evidence Table */}
                <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'auto' }}>
                    <table className="auditee-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Control</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Asset</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Due Date</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Priority</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #eef2f6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvidence.map(item => {
                                const statusColor = getStatusColor(item.status);
                                return (
                                    <tr key={item.id} className="clickable-row" onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{item.control}</td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{item.asset}</td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: item.status === 'overdue' ? '#b91c1c' : '#1e293b', borderBottom: '1px solid #f1f5f9', fontWeight: item.status === 'overdue' ? 600 : 400 }}>
                                            {item.dueDate}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: statusColor.bg, color: statusColor.color }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '12px', 
                                                fontSize: '11px',
                                                background: item.priority === 'critical' ? '#fee8e8' : 
                                                           item.priority === 'high' ? '#fff1e6' : '#f1f5f9',
                                                color: item.priority === 'critical' ? '#b91c1c' : 
                                                       item.priority === 'high' ? '#b45309' : '#64748b'
                                            }}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
                                            {item.status !== 'uploaded' ? (
                                                <button 
                                                    className="btn-upload" 
                                                    onClick={(e) => handleUploadClick(item, e)}
                                                    style={{ 
                                                        background: '#1e293b', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        padding: '6px 12px', 
                                                        borderRadius: '6px', 
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        marginRight: '8px'
                                                    }}
                                                >
                                                    <FaUpload size={12} /> Upload
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn-download" 
                                                    onClick={(e) => handleDownload(item, e)}
                                                    style={{ 
                                                        background: '#f1f5f9', 
                                                        border: '1px solid #e2e8f0',
                                                        padding: '6px 12px', 
                                                        borderRadius: '6px', 
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '12px',
                                                        color: '#1e293b',
                                                        marginRight: '8px'
                                                    }}
                                                >
                                                    <FaDownload size={12} /> Download
                                                </button>
                                            )}
                                            <button 
                                                className="btn-delete"
                                                onClick={(e) => handleDelete(item.id, e)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: '#64748b', 
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                                title="Delete"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* MODALS */}
                <DetailModal />
                <UploadModal />
                <AddEvidenceModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyEvidence;