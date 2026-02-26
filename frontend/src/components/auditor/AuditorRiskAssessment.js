// src/components/auditor/AuditorRiskAssessment.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaExclamationTriangle, FaSearch, FaPlus, FaEdit, 
    FaTrash, FaEye, FaFilter, FaBug, FaTimes,
    FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditor.css';

const AuditorRiskAssessment = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [assets, setAssets] = useState([]);

    // STATE UNTUK FORM
    const [formName, setFormName] = useState('');
    const [formAssetId, setFormAssetId] = useState('');
    const [formCvss, setFormCvss] = useState('5.0');
    const [formDesc, setFormDesc] = useState('');
    const [formCategory, setFormCategory] = useState('Injection');
    const [formLikelihood, setFormLikelihood] = useState('Medium');
    const [formImpact, setFormImpact] = useState('Medium');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Ambil semua vulnerabilities
            const vulnsRes = await api.get('/findings/');
            setVulnerabilities(vulnsRes.data || []);
            
            // 2. Ambil semua assets
            const assetsRes = await api.get('/assets/');
            setAssets(assetsRes.data || []);
            
        } catch (error) {
            console.error('Error fetching risk assessment data:', error);
        } finally {
            setLoading(false);
        }
    };

    // HITUNG RISK MATRIX
    const riskMatrix = {
        critical: vulnerabilities.filter(v => v.severity === 'critical').length,
        high: vulnerabilities.filter(v => v.severity === 'high').length,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length
    };

    // FILTER VULNERABILITIES
    const filteredVulns = vulnerabilities.filter(v => {
        const matchesSearch = v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.asset?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRisk === 'all' || v.severity?.toLowerCase() === filterRisk.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    // FUNGSI HITUNG RISK
    const calculateRisk = (likelihood, impact) => {
        const likelihoodScore = { 'Low': 1, 'Medium': 2, 'High': 3 }[likelihood] || 1;
        const impactScore = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 }[impact] || 1;
        const score = likelihoodScore * impactScore;
        
        if (score >= 12) return 'Critical';
        if (score >= 8) return 'High';
        if (score >= 4) return 'Medium';
        return 'Low';
    };

    // RESET FORM
    const resetForm = () => {
        setFormName('');
        setFormAssetId('');
        setFormCvss('5.0');
        setFormDesc('');
        setFormCategory('Injection');
        setFormLikelihood('Medium');
        setFormImpact('Medium');
    };

    // HANDLE ADD
    const handleAddVuln = async (e) => {
        e.preventDefault();
        
        const asset = assets.find(a => a.id === parseInt(formAssetId));
        const risk = calculateRisk(formLikelihood, formImpact);
        
        try {
            const response = await api.post('/findings/', {
                title: formName,
                category: formCategory,
                asset: asset?.name || formAssetId,
                assetId: parseInt(formAssetId),
                cvss: parseFloat(formCvss),
                severity: risk.toLowerCase(),
                status: 'open',
                discovered: new Date().toISOString().split('T')[0],
                likelihood: formLikelihood,
                impact: formImpact,
                description: formDesc,
                company_id: asset?.company_id
            });
            
            if (response.data) {
                fetchData();
                setShowAddModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error adding vulnerability:', error);
            alert('Failed to add vulnerability');
        }
    };

    // HANDLE DELETE
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this vulnerability?')) {
            try {
                await api.delete(`/findings/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting vulnerability:', error);
            }
        }
    };

    // HANDLE VIEW DETAIL
    const handleViewDetail = (vuln) => {
        setSelectedVuln(vuln);
        setShowDetailModal(true);
    };

    // GET RISK COLOR
    const getRiskColor = (risk) => {
        switch(risk?.toLowerCase()) {
            case 'critical': return '#b91c1c';
            case 'high': return '#b45309';
            case 'medium': return '#b68b40';
            default: return '#166534';
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="auditor">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading risk assessment...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="auditor">
            <div className="auditor-page">
                {/* HEADER */}
                <div className="page-header">
                    <div>
                        <h2><FaExclamationTriangle /> Risk Assessment</h2>
                        <p>OWASP Top 10 Vulnerability Management</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Add New Assessment
                    </button>
                </div>

                {/* RISK MATRIX */}
                <div className="risk-matrix-card">
                    <h3>Risk Matrix (Likelihood × Impact)</h3>
                    <div className="risk-summary">
                        <div className="risk-item">
                            <span className="risk-label">Critical</span>
                            <span className="risk-value" style={{color: '#b91c1c', fontWeight: 'bold'}}>{riskMatrix.critical}</span>
                        </div>
                        <div className="risk-item">
                            <span className="risk-label">High</span>
                            <span className="risk-value" style={{color: '#b45309', fontWeight: 'bold'}}>{riskMatrix.high}</span>
                        </div>
                        <div className="risk-item">
                            <span className="risk-label">Medium</span>
                            <span className="risk-value" style={{color: '#b68b40', fontWeight: 'bold'}}>{riskMatrix.medium}</span>
                        </div>
                        <div className="risk-item">
                            <span className="risk-label">Low</span>
                            <span className="risk-value" style={{color: '#166534', fontWeight: 'bold'}}>{riskMatrix.low}</span>
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTER */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search vulnerabilities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                            <option value="all">All Risks</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-container">
                    <table className="auditor-table">
                        <thead>
                            <tr>
                                <th>Vulnerability</th>
                                <th>Category</th>
                                <th>Asset</th>
                                <th>CVSS</th>
                                <th>Risk</th>
                                <th>Status</th>
                                <th>Discovered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVulns.map(v => (
                                <tr key={v.id}>
                                    <td><strong>{v.title}</strong></td>
                                    <td>{v.category || 'General'}</td>
                                    <td>{v.asset}</td>
                                    <td>{v.cvss || 'N/A'}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            background: `${getRiskColor(v.severity)}20`,
                                            color: getRiskColor(v.severity)
                                        }}>
                                            {v.severity}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            background: v.status === 'open' ? '#fee8e8' : 
                                                       v.status === 'in-progress' ? '#fff1e6' : '#e6f7e6',
                                            color: v.status === 'open' ? '#b91c1c' : 
                                                   v.status === 'in-progress' ? '#b45309' : '#166534'
                                        }}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td>{v.discovered}</td>
                                    <td>
                                        <button className="icon-btn" onClick={() => handleViewDetail(v)}><FaEye /></button>
                                        <button className="icon-btn" onClick={(e) => handleDelete(v.id, e)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL ADD */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetForm(); }}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3><FaBug /> Add New Vulnerability</h3>
                                    <button className="close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>×</button>
                            </div>
                            
                            <form onSubmit={handleAddVuln}>
                                {/* NAME */}
                                <div className="form-group">
                                    <label>Vulnerability Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g., SQL Injection"
                                        autoFocus
                                    />
                                </div>

                                {/* CATEGORY */}
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                        <option value="Injection">Injection</option>
                                        <option value="Broken Authentication">Broken Authentication</option>
                                        <option value="Sensitive Data Exposure">Sensitive Data Exposure</option>
                                        <option value="XML External Entities">XML External Entities (XXE)</option>
                                        <option value="Broken Access Control">Broken Access Control</option>
                                        <option value="Security Misconfiguration">Security Misconfiguration</option>
                                        <option value="Cross-Site Scripting (XSS)">Cross-Site Scripting (XSS)</option>
                                        <option value="Insecure Deserialization">Insecure Deserialization</option>
                                        <option value="Using Components with Known Vulnerabilities">Using Components with Known Vulnerabilities</option>
                                        <option value="Insufficient Logging & Monitoring">Insufficient Logging & Monitoring</option>
                                    </select>
                                </div>

                                {/* ASSET */}
                                <div className="form-group">
                                    <label>Asset *</label>
                                    <select
                                        required
                                        value={formAssetId}
                                        onChange={(e) => setFormAssetId(e.target.value)}
                                    >
                                        <option value="">Select Asset</option>
                                        {assets.map(asset => (
                                            <option key={asset.id} value={asset.id}>
                                                {asset.name} ({asset.type}) - {asset.companyName || 'No Company'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    {/* LIKELIHOOD */}
                                    <div className="form-group">
                                        <label>Likelihood</label>
                                        <select value={formLikelihood} onChange={(e) => setFormLikelihood(e.target.value)}>
                                            <option value="Low">Low (1)</option>
                                            <option value="Medium">Medium (2)</option>
                                            <option value="High">High (3)</option>
                                        </select>
                                    </div>

                                    {/* IMPACT */}
                                    <div className="form-group">
                                        <label>Impact</label>
                                        <select value={formImpact} onChange={(e) => setFormImpact(e.target.value)}>
                                            <option value="Low">Low (1)</option>
                                            <option value="Medium">Medium (2)</option>
                                            <option value="High">High (3)</option>
                                            <option value="Critical">Critical (4)</option>
                                        </select>
                                    </div>

                                    {/* CVSS */}
                                    <div className="form-group">
                                        <label>CVSS Score</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={formCvss}
                                            onChange={(e) => setFormCvss(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows="3"
                                        value={formDesc}
                                        onChange={(e) => setFormDesc(e.target.value)}
                                        placeholder="Describe the vulnerability, impact, and remediation steps..."
                                    />
                                </div>

                                {/* RISK PREVIEW */}
                                <div className="risk-preview">
                                    <h4>Risk Preview</h4>
                                    <p>Likelihood: <strong>{formLikelihood}</strong> × Impact: <strong>{formImpact}</strong></p>
                                    <p>Calculated Risk: <strong style={{
                                        color: getRiskColor(calculateRisk(formLikelihood, formImpact)),
                                        fontSize: '16px'
                                    }}>{calculateRisk(formLikelihood, formImpact)}</strong></p>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        <FaPlus /> Add Vulnerability
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL DETAIL */}
                {showDetailModal && selectedVuln && (
                    <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3><FaBug /> {selectedVuln.title}</h3>
                                <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="detail-grid">
                                    <div className="detail-row">
                                        <label>Category:</label>
                                        <span>{selectedVuln.category || 'General'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Asset:</label>
                                        <span>{selectedVuln.asset}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Risk:</label>
                                        <span style={{color: getRiskColor(selectedVuln.severity), fontWeight: 'bold'}}>
                                            {selectedVuln.severity?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <label>CVSS:</label>
                                        <span>{selectedVuln.cvss || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Status:</label>
                                        <span>{selectedVuln.status}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Discovered:</label>
                                        <span>{selectedVuln.discovered}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Likelihood:</label>
                                        <span>{selectedVuln.likelihood || 'Medium'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Impact:</label>
                                        <span>{selectedVuln.impact || 'Medium'}</span>
                                    </div>
                                    <div className="detail-row full-width">
                                        <label>Description:</label>
                                        <p>{selectedVuln.description || 'No description provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                                <button className="btn-primary"><FaEdit /> Edit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AuditorRiskAssessment;
                                