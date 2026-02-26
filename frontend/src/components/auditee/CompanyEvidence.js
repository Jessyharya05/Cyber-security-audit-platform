// src/components/auditee/CompanyEvidence.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaUpload, FaSearch, FaFilter, FaDownload,
    FaEye, FaTimes, FaCheckCircle, FaClock,
    FaExclamationTriangle, FaFilePdf, FaFileImage,
    FaCloudUploadAlt, FaFileAlt, FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditee.css';

const CompanyEvidence = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [evidence, setEvidence] = useState([]);
    const [uploadModal, setUploadModal] = useState({ show: false, item: null });
    const [addModal, setAddModal] = useState({ show: false });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [modalData, setModalData] = useState({ show: false, title: '', items: [] });

    const [newEvidence, setNewEvidence] = useState({
        control: '',
        asset: '',
        dueDate: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchEvidence();
    }, []);

    const fetchEvidence = async () => {
        setLoading(true);
        try {
            const companyId = user?.companyId || 1;
            const response = await api.get(`/evidence/company/${companyId}`);
            setEvidence(response.data || []);
        } catch (error) {
            console.error('Error fetching evidence:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = {
        total: evidence.length,
        uploaded: evidence.filter(e => e.status === 'uploaded').length,
        pending: evidence.filter(e => e.status === 'pending').length,
        overdue: evidence.filter(e => e.status === 'overdue').length
    };

    // Filter
    const filteredEvidence = evidence.filter(e => {
        const matchesSearch = e.control?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             e.asset?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Handle stat click
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

    // Handle row click
    const handleRowClick = (item) => {
        setModalData({ show: true, title: 'Evidence Details', items: [item] });
    };

    // Handle upload click
    const handleUploadClick = (item, e) => {
        e.stopPropagation();
        setUploadModal({ show: true, item });
        setSelectedFile(null);
        setUploadProgress(0);
    };

    // Handle add click
    const handleAddClick = () => {
        setAddModal({ show: true });
        setNewEvidence({ control: '', asset: '', dueDate: '', priority: 'medium' });
    };

    // Handle add submit
    // ===== HANDLE ADD SUBMIT - FIXED =====
const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEvidence.control || !newEvidence.asset || !newEvidence.dueDate) {
        alert('Please fill all required fields');
        return;
    }

    try {
        const companyId = user?.companyId || 1;
        
        // PAKAI ENDPOINT YANG SAMA DENGAN UPLOAD TAPI TANPA FILE
        // Atau minta backend buatin endpoint khusus
        
        // OPSI 1: PAKE ENDPOINT UPLOAD DENGAN FILE DUMMY
        const formData = new FormData();
        formData.append('company_id', companyId);
        formData.append('control', newEvidence.control);
        formData.append('asset', newEvidence.asset);
        formData.append('due_date', newEvidence.dueDate);
        formData.append('priority', newEvidence.priority);
        
        // Buat file dummy (minimal 1 byte)
        const dummyBlob = new Blob([' '], { type: 'text/plain' });
        formData.append('file', dummyBlob, 'dummy.txt');
        
        const response = await api.post('/evidence/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data) {
            await fetchEvidence();
            setAddModal({ show: false });
            setNewEvidence({ control: '', asset: '', dueDate: '', priority: 'medium' });
            alert('Evidence added successfully!');
        }
    } catch (error) {
        console.error('Error adding evidence:', error);
        alert('Failed to add evidence: ' + (error.response?.data?.detail || error.message));
    }
};

// src/components/auditee/CompanyEvidence.js (LANJUTAN)

    // Handle delete
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this evidence requirement?')) {
            try {
                await api.delete(`/evidence/${id}`);
                fetchEvidence();
            } catch (error) {
                console.error('Error deleting evidence:', error);
                alert('Failed to delete evidence');
            }
        }
    };

    // Handle file select
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('File type not allowed. Please upload PDF, JPEG, PNG, or DOC.');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert('File too large. Maximum size is 10MB.');
                return;
            }
            
            setSelectedFile(file);
        }
    };

    // Handle upload submit
    const handleUploadSubmit = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        setIsUploading(true);
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('company_id', user?.companyId || 1);
        formData.append('control', uploadModal.item.control);
        formData.append('asset', uploadModal.item.asset);
        formData.append('priority', uploadModal.item.priority || 'medium');

        try {
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await api.post('/evidence/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            clearInterval(interval);
            setUploadProgress(100);

            setTimeout(() => {
                if (response.data) {
                    fetchEvidence();
                    setIsUploading(false);
                    setUploadModal({ show: false, item: null });
                    alert('✅ File uploaded successfully!');
                }
            }, 500);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
            setIsUploading(false);
        }
    };

    // Handle download
    const handleDownload = async (item, e) => {
        e.stopPropagation();
        try {
            const response = await api.get(`/evidence/${item.id}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', item.filename || 'evidence.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'uploaded': return { bg: '#e6f7e6', color: '#166534' };
            case 'pending': return { bg: '#f1f5f9', color: '#64748b' };
            case 'overdue': return { bg: '#fee8e8', color: '#b91c1c' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    // Modal Detail
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

    // Upload Modal
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
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Due Date: {item.dueDate || item.due_date}</p>
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
                                        Supported: PDF, JPEG, PNG, DOC (Max 10MB)
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
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleUploadSubmit}
                                disabled={isUploading || !selectedFile}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Evidence'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Add Evidence Modal
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
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Due Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvidence.dueDate}
                                        onChange={(e) => setNewEvidence({...newEvidence, dueDate: e.target.value})}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={newEvidence.priority}
                                        onChange={(e) => setNewEvidence({...newEvidence, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setAddModal({ show: false })}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                <FaPlus /> Add Evidence
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
                    <p>Loading evidence...</p>
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
                        <h2><FaUpload /> Evidence Collection</h2>
                        <p>Upload required evidence for audit controls</p>
                    </div>
                    <button className="btn-primary" onClick={handleAddClick}>
                        <FaPlus /> Add Evidence
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card clickable" onClick={() => handleStatClick('total')}>
                        <div className="stat-icon blue"><FaUpload /></div>
                        <h3>{stats.total}</h3>
                        <p>Total Required</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('uploaded')}>
                        <div className="stat-icon green"><FaCheckCircle /></div>
                        <h3>{stats.uploaded}</h3>
                        <p>Uploaded</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('pending')}>
                        <div className="stat-icon orange"><FaClock /></div>
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>

                    <div className="stat-card clickable" onClick={() => handleStatClick('overdue')}>
                        <div className="stat-icon red"><FaExclamationTriangle /></div>
                        <h3>{stats.overdue}</h3>
                        <p>Overdue</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search evidence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="uploaded">Uploaded</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Evidence Table */}
                <div className="table-container">
                    <table className="auditee-table">
                        <thead>
                            <tr>
                                <th>Control</th>
                                <th>Asset</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvidence.map(item => {
                                const statusColor = getStatusColor(item.status);
                                return (
                                    <tr key={item.id} className="clickable-row" onClick={() => handleRowClick(item)}>
                                        <td>{item.control}</td>
                                        <td>{item.asset}</td>
                                        <td style={{ color: item.status === 'overdue' ? '#b91c1c' : 'inherit' }}>
                                            {item.due_date || item.dueDate}
                                        </td>
                                        <td>
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', background: statusColor.bg, color: statusColor.color }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
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
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {item.status !== 'uploaded' ? (
                                                <button className="btn-upload" onClick={(e) => handleUploadClick(item, e)}>
                                                    <FaUpload size={12} /> Upload
                                                </button>
                                            ) : (
                                                <button className="btn-download" onClick={(e) => handleDownload(item, e)}>
                                                    <FaDownload size={12} /> Download
                                                </button>
                                            )}
                                            <button className="btn-delete" onClick={(e) => handleDelete(item.id, e)} title="Delete">
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                <DetailModal />
                <UploadModal />
                <AddEvidenceModal />
            </div>
        </DashboardLayout>
    );
};

export default CompanyEvidence;