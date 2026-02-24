// src/components/auditee/CompanyEvidence.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaUpload, 
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaFileCode
} from 'react-icons/fa';
import './Auditee.css';

const CompanyEvidence = () => {
  const [evidence, setEvidence] = useState([
    {
      id: 1,
      control: 'Password Policy',
      description: 'Company password policy document',
      asset: 'HR System',
      dueDate: '2024-03-01',
      status: 'pending',
      priority: 'high',
      filename: 'password_policy.pdf',
      filesize: '245 KB',
      uploadedBy: null,
      uploadedAt: null
    },
    {
      id: 2,
      control: 'Backup Procedure',
      description: 'Database backup configuration and schedule',
      asset: 'Database',
      dueDate: '2024-03-03',
      status: 'uploaded',
      priority: 'critical',
      filename: 'backup_config.pdf',
      filesize: '180 KB',
      uploadedBy: 'Admin User',
      uploadedAt: '2024-02-20'
    },
    {
      id: 3,
      control: 'Access Control List',
      description: 'User permissions and access matrix',
      asset: 'File Server',
      dueDate: '2024-02-28',
      status: 'overdue',
      priority: 'high',
      filename: null,
      filesize: null,
      uploadedBy: null,
      uploadedAt: null
    },
    {
      id: 4,
      control: 'Firewall Configuration',
      description: 'Firewall rules and policies',
      asset: 'Network',
      dueDate: '2024-03-05',
      status: 'pending',
      priority: 'medium',
      filename: null,
      filesize: null,
      uploadedBy: null,
      uploadedAt: null
    },
    {
      id: 5,
      control: 'Incident Response Plan',
      description: 'IR procedures and contact list',
      asset: 'All Systems',
      dueDate: '2024-03-07',
      status: 'pending',
      priority: 'medium',
      filename: null,
      filesize: null,
      uploadedBy: null,
      uploadedAt: null
    },
    {
      id: 6,
      control: 'Encryption Policy',
      description: 'Data encryption standards',
      asset: 'Database',
      dueDate: '2024-03-02',
      status: 'uploaded',
      priority: 'high',
      filename: 'encryption_policy.pdf',
      filesize: '320 KB',
      uploadedBy: 'Admin User',
      uploadedAt: '2024-02-21'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // src/components/auditee/CompanyEvidence.js (LANJUTAN)

  const handleUploadClick = (item) => {
    setSelectedEvidence(item);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUploadSubmit = () => {
    if (uploadFile && selectedEvidence) {
      // Simulate upload
      setEvidence(evidence.map(item => 
        item.id === selectedEvidence.id 
          ? { 
              ...item, 
              status: 'uploaded',
              filename: uploadFile.name,
              filesize: `${Math.round(uploadFile.size / 1024)} KB`,
              uploadedBy: 'Current User',
              uploadedAt: new Date().toISOString().split('T')[0]
            }
          : item
      ));
      setShowUploadModal(false);
      setUploadFile(null);
      setSelectedEvidence(null);
    }
  };

  const handleDeleteEvidence = (id) => {
    if (window.confirm('Are you sure you want to delete this evidence?')) {
      setEvidence(evidence.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: 'pending',
              filename: null,
              filesize: null,
              uploadedBy: null,
              uploadedAt: null
            }
          : item
      ));
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'uploaded':
        return <span className="status-badge good"><FaCheckCircle /> Uploaded</span>;
      case 'pending':
        return <span className="status-badge"><FaClock /> Pending</span>;
      case 'overdue':
        return <span className="status-badge critical"><FaExclamationTriangle /> Overdue</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'critical':
        return <span className="priority-badge critical">Critical</span>;
      case 'high':
        return <span className="priority-badge high">High</span>;
      case 'medium':
        return <span className="priority-badge medium">Medium</span>;
      default:
        return <span className="priority-badge">{priority}</span>;
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FaFileAlt />;
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className="pdf-icon" />;
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return <FaFileImage className="image-icon" />;
    if (ext === 'conf' || ext === 'config' || ext === 'js' || ext === 'py') return <FaFileCode className="code-icon" />;
    return <FaFileAlt />;
  };

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaUpload /> Evidence Collection</h2>
            <p>Upload required evidence for audit controls</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => handleUploadClick(null)}>
              <FaCloudUploadAlt /> Upload New
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>{evidence.length}</h3>
              <p>Total Required</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{evidence.filter(e => e.status === 'uploaded').length}</h3>
              <p>Uploaded</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{evidence.filter(e => e.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{evidence.filter(e => e.status === 'overdue').length}</h3>
              <p>Overdue</p>
            </div>
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
                <th>Control / Evidence</th>
                <th>Asset</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>File</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidence.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="evidence-info">
                      <strong>{item.control}</strong>
                      <small>{item.description}</small>
                    </div>
                  </td>
                  <td>{item.asset}</td>
                  <td className={new Date(item.dueDate) < new Date() && item.status !== 'uploaded' ? 'overdue-date' : ''}>
                    {item.dueDate}
                  </td>
                  <td>{getPriorityBadge(item.priority)}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    {item.filename ? (
                      <div className="file-info">
                        {getFileIcon(item.filename)}
                        <span>{item.filename}</span>
                        <small>({item.filesize})</small>
                      </div>
                    ) : (
                      <span className="no-file">No file uploaded</span>
                    )}
                  </td>
                  <td>{item.uploadedBy || '-'}</td>
                  <td>
                    {item.status === 'uploaded' ? (
                      <>
                        <button className="icon-btn" title="Download"><FaDownload /></button>
                        <button className="icon-btn" title="Delete" onClick={() => handleDeleteEvidence(item.id)}><FaTrash /></button>
                      </>
                    ) : (
                      <button 
                        className="upload-btn" 
                        onClick={() => handleUploadClick(item)}
                      >
                        <FaUpload /> Upload
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3><FaUpload /> Upload Evidence</h3>
              
              {selectedEvidence && (
                <div className="upload-info">
                  <p><strong>Control:</strong> {selectedEvidence.control}</p>
                  <p><strong>Asset:</strong> {selectedEvidence.asset}</p>
                  <p><strong>Due Date:</strong> {selectedEvidence.dueDate}</p>
                </div>
              )}

              <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <FaCloudUploadAlt className="upload-icon" />
                <p>Click to select file or drag and drop</p>
                <small>Supported: PDF, PNG, JPG, TXT, CONF (Max 10MB)</small>
              </div>

              {uploadFile && (
                <div className="selected-file">
                  <FaFileAlt /> {uploadFile.name} ({(uploadFile.size / 1024).toFixed(0)} KB)
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleUploadSubmit}
                  disabled={!uploadFile}
                >
                  <FaUpload /> Upload Evidence
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyEvidence;