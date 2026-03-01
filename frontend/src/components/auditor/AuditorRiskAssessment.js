// src/components/auditor/AuditorRiskAssessment.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaExclamationTriangle, FaSearch, FaPlus, FaEdit, 
    FaTrash, FaEye, FaFilter, FaBug, FaSave
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVuln, setSelectedVuln] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [assets, setAssets] = useState([]);

    // STATE FORM ADD
    const [formName, setFormName] = useState('');
    const [formAssetId, setFormAssetId] = useState('');
    const [formCvss, setFormCvss] = useState('5.0');
    const [formDesc, setFormDesc] = useState('');
    const [formCategory, setFormCategory] = useState('Injection');
    const [formLikelihood, setFormLikelihood] = useState('Medium');
    const [formImpact, setFormImpact] = useState('Medium');

    // STATE FORM EDIT
    const [editForm, setEditForm] = useState({
        title: '', category: '', asset: '', assetId: '',
        cvss: '', severity: '', status: '',
        likelihood: '', impact: '', description: '', recommendation: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Ambil vulnerabilities/findings
            const vulnsRes = await api.get('/findings/');
            setVulnerabilities(vulnsRes.data || []);

            // ✅ FIX: pakai /assets/my-assets — backend handle logika auditor vs auditee
            const assetsRes = await api.get('/assets/my-assets');
            console.log('✅ Assets fetched:', assetsRes.data);
            setAssets(assetsRes.data || []);

        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // RISK MATRIX
    const riskMatrix = {
        critical: vulnerabilities.filter(v => v.severity === 'critical').length,
        high: vulnerabilities.filter(v => v.severity === 'high').length,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length
    };

    // FILTER
    const filteredVulns = vulnerabilities.filter(v => {
        const matchesSearch = v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              v.asset?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRisk === 'all' || v.severity?.toLowerCase() === filterRisk;
        return matchesSearch && matchesFilter;
    });

    // HITUNG RISK
    const calculateRisk = (likelihood, impact) => {
        const l = { 'Low': 1, 'Medium': 2, 'High': 3 }[likelihood] || 1;
        const i = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 }[impact] || 1;
        const score = l * i;
        if (score >= 12) return 'Critical';
        if (score >= 8) return 'High';
        if (score >= 4) return 'Medium';
        return 'Low';
    };

    const resetForm = () => {
        setFormName(''); setFormAssetId(''); setFormCvss('5.0');
        setFormDesc(''); setFormCategory('Injection');
        setFormLikelihood('Medium'); setFormImpact('Medium');
    };

    // HANDLE ADD
    const handleAddVuln = async (e) => {
        e.preventDefault();
        const asset = assets.find(a => a.id === parseInt(formAssetId));
        const risk = calculateRisk(formLikelihood, formImpact);

        try {
            await api.post('/findings/', {
                title: formName,
                category: formCategory,
                asset: asset?.name || '',
                asset_id: parseInt(formAssetId),
                cvss: parseFloat(formCvss),
                severity: risk.toLowerCase(),
                status: 'open',
                discovered: new Date().toISOString().split('T')[0],
                likelihood: formLikelihood,
                impact: formImpact,
                description: formDesc,
                company_id: asset?.company_id
            });

            await fetchData();
            setShowAddModal(false);
            resetForm();
            alert('✅ Vulnerability added successfully!');
        } catch (error) {
            console.error('Error adding vulnerability:', error);
            alert('❌ Failed to add: ' + (error.response?.data?.detail || error.message));
        }
    };

    // HANDLE EDIT OPEN
    const handleEdit = (vuln) => {
        setSelectedVuln(vuln);
        setEditForm({
            title: vuln.title || '',
            category: vuln.category || '',
            asset: vuln.asset_name || vuln.asset || '',
            assetId: vuln.asset_id ? vuln.asset_id.toString() : '',
            cvss: vuln.cvss_score || vuln.cvss || '5.0',
            severity: vuln.risk_level || vuln.severity || 'medium',
            status: vuln.status || 'Open',
            likelihood: vuln.likelihood || 'Medium',
            impact: vuln.impact || 'Medium',
            description: vuln.description || '',
            recommendation: vuln.recommendation || ''
        });
        setShowEditModal(true);
        setShowDetailModal(false);
    };

    // HANDLE EDIT SUBMIT
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedVuln) return;
        const risk = calculateRisk(editForm.likelihood, editForm.impact);

        try {
            await api.put(`/findings/${selectedVuln.id}`, {
                title: editForm.title,
                category: editForm.category,
                asset: editForm.asset,
                asset_id: parseInt(editForm.assetId),
                cvss: parseFloat(editForm.cvss),
                severity: risk.toLowerCase(),
                status: editForm.status,
                likelihood: editForm.likelihood,
                impact: editForm.impact,
                description: editForm.description
            });

            await fetchData();
            setShowEditModal(false);
            setSelectedVuln(null);
            alert('✅ Vulnerability updated successfully!');
        } catch (error) {
            console.error('Error updating:', error);
            alert('❌ Failed to update: ' + (error.response?.data?.detail || error.message));
        }
    };

    // HANDLE DELETE
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this vulnerability?')) {
            try {
                await api.delete(`/findings/${id}`);
                await fetchData();
                alert('✅ Deleted successfully!');
            } catch (error) {
                alert('❌ Failed to delete');
            }
        }
    };

    // HELPERS
    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'critical': return '#b91c1c';
            case 'high': return '#b45309';
            case 'medium': return '#b68b40';
            default: return '#166534';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return { bg: '#fee8e8', color: '#b91c1c' };
            case 'in-progress': return { bg: '#fff1e6', color: '#b45309' };
            case 'closed': return { bg: '#e6f7e6', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    // REUSABLE ASSET DROPDOWN — supaya tidak duplikat kode
    const AssetDropdown = ({ value, onChange, required = false }) => (
        <div className="form-group">
            <label>Asset {required && '*'}</label>
            <select value={value} onChange={onChange} required={required}>
                <option value="">Select Asset</option>
                {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.type || 'Unknown'})
                    </option>
                ))}
            </select>
            {assets.length === 0 && (
                <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: 4 }}>
                    ⚠️ Tidak ada asset ditemukan. Pastikan company sudah punya asset.
                </p>
            )}
        </div>
    );

    // REUSABLE CATEGORY DROPDOWN
    const CategoryOptions = () => (
        <>
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
        </>
    );

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
                        {['critical', 'high', 'medium', 'low'].map(level => (
                            <div className="risk-item" key={level}>
                                <span className="risk-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                                <span className="risk-value" style={{ color: getRiskColor(level), fontWeight: 'bold' }}>
                                    {riskMatrix[level]}
                                </span>
                            </div>
                        ))}
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
                            {filteredVulns.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No vulnerabilities found
                                    </td>
                                </tr>
                            ) : (
                                filteredVulns.map(v => {
                                    const statusColor = getStatusColor(v.status);
                                    return (
                                        <tr key={v.id}>
                                            <td><strong>{v.title}</strong></td>
                                            <td>{v.category || 'General'}</td>
                                            <td>{v.asset}</td>
                                            <td>{v.cvss || 'N/A'}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '12px',
                                                    fontSize: '11px', fontWeight: 'bold',
                                                    background: `${getRiskColor(v.severity)}20`,
                                                    color: getRiskColor(v.severity)
                                                }}>
                                                    {v.severity?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '12px',
                                                    fontSize: '11px',
                                                    background: statusColor.bg, color: statusColor.color
                                                }}>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td>{v.discovered}</td>
                                            <td>
                                                <button className="icon-btn" onClick={() => { setSelectedVuln(v); setShowDetailModal(true); }} title="View"><FaEye /></button>
                                                <button className="icon-btn" onClick={() => handleEdit(v)} title="Edit"><FaEdit /></button>
                                                <button className="icon-btn" onClick={(e) => handleDelete(v.id, e)} title="Delete"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
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
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Vulnerability Name *</label>
                                        <input type="text" required value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder="e.g., SQL Injection" autoFocus />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                            <CategoryOptions />
                                        </select>
                                    </div>

                                    {/* ✅ FIX: assets sekarang sudah terisi dari /assets/my-assets */}
                                    <AssetDropdown
                                        value={formAssetId}
                                        onChange={(e) => setFormAssetId(e.target.value)}
                                        required
                                    />

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Likelihood</label>
                                            <select value={formLikelihood} onChange={(e) => setFormLikelihood(e.target.value)}>
                                                <option value="Low">Low (1)</option>
                                                <option value="Medium">Medium (2)</option>
                                                <option value="High">High (3)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Impact</label>
                                            <select value={formImpact} onChange={(e) => setFormImpact(e.target.value)}>
                                                <option value="Low">Low (1)</option>
                                                <option value="Medium">Medium (2)</option>
                                                <option value="High">High (3)</option>
                                                <option value="Critical">Critical (4)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>CVSS Score</label>
                                            <input type="number" step="0.1" min="0" max="10"
                                                value={formCvss} onChange={(e) => setFormCvss(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea rows="3" value={formDesc}
                                            onChange={(e) => setFormDesc(e.target.value)}
                                            placeholder="Describe the vulnerability..." />
                                    </div>

                                    <div className="risk-preview">
                                        <h4>Risk Preview</h4>
                                        <p>Likelihood: <strong>{formLikelihood}</strong> × Impact: <strong>{formImpact}</strong></p>
                                        <p>Calculated Risk: <strong style={{
                                            color: getRiskColor(calculateRisk(formLikelihood, formImpact)), fontSize: '16px'
                                        }}>{calculateRisk(formLikelihood, formImpact)}</strong></p>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                                    <button type="submit" className="btn-primary"><FaPlus /> Add Vulnerability</button>
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
                                    {[
                                        ['Category', selectedVuln.category || 'General'],
                                        ['Asset', selectedVuln.asset],
                                        ['Risk', <span style={{ color: getRiskColor(selectedVuln.severity), fontWeight: 'bold' }}>{selectedVuln.severity?.toUpperCase()}</span>],
                                        ['CVSS', selectedVuln.cvss || 'N/A'],
                                        ['Status', selectedVuln.status],
                                        ['Discovered', selectedVuln.discovered],
                                        ['Likelihood', selectedVuln.likelihood || 'Medium'],
                                        ['Impact', selectedVuln.impact || 'Medium'],
                                    ].map(([label, val]) => (
                                        <div className="detail-row" key={label}>
                                            <label>{label}:</label>
                                            <span>{val}</span>
                                        </div>
                                    ))}
                                    <div className="detail-row full-width">
                                        <label>Description:</label>
                                        <p>{selectedVuln.description || 'No description provided'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                                <button className="btn-primary" onClick={() => handleEdit(selectedVuln)}><FaEdit /> Edit</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL EDIT */}
                {showEditModal && selectedVuln && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3><FaEdit /> Edit Vulnerability</h3>
                                <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Vulnerability Name *</label>
                                        <input type="text" required value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            placeholder="e.g., SQL Injection" />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select value={editForm.category}
                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                                            <CategoryOptions />
                                        </select>
                                    </div>

                                    {/* ✅ FIX: assets sudah terisi, dropdown tidak kosong lagi */}
                                    <div className="form-group">
                                        <label>Asset *</label>
                                        <select required value={editForm.assetId}
                                            onChange={(e) => {
                                                const selected = assets.find(a => a.id === parseInt(e.target.value));
                                                setEditForm({ ...editForm, assetId: e.target.value, asset: selected?.name || '' });
                                            }}>
                                            <option value="">Select Asset</option>
                                            {assets.map(asset => (
                                                <option key={asset.id} value={asset.id}>
                                                    {asset.name} ({asset.type || 'Unknown'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Likelihood</label>
                                            <select value={editForm.likelihood}
                                                onChange={(e) => setEditForm({ ...editForm, likelihood: e.target.value })}>
                                                <option value="Low">Low (1)</option>
                                                <option value="Medium">Medium (2)</option>
                                                <option value="High">High (3)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Impact</label>
                                            <select value={editForm.impact}
                                                onChange={(e) => setEditForm({ ...editForm, impact: e.target.value })}>
                                                <option value="Low">Low (1)</option>
                                                <option value="Medium">Medium (2)</option>
                                                <option value="High">High (3)</option>
                                                <option value="Critical">Critical (4)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>CVSS Score</label>
                                            <input type="number" step="0.1" min="0" max="10"
                                                value={editForm.cvss}
                                                onChange={(e) => setEditForm({ ...editForm, cvss: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                                            <option value="open">Open</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea rows="3" value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Describe the vulnerability..." />
                                    </div>

                                    <div className="risk-preview">
                                        <h4>Risk Preview</h4>
                                        <p>Likelihood: <strong>{editForm.likelihood}</strong> × Impact: <strong>{editForm.impact}</strong></p>
                                        <p>Calculated Risk: <strong style={{
                                            color: getRiskColor(calculateRisk(editForm.likelihood, editForm.impact)), fontSize: '16px'
                                        }}>{calculateRisk(editForm.likelihood, editForm.impact)}</strong></p>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary"><FaSave /> Update Vulnerability</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default AuditorRiskAssessment;