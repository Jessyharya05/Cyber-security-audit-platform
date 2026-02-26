import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
    FaExclamationTriangle, FaSearch, FaPlus, FaEdit, 
    FaTrash, FaEye, FaFilter, FaBug, FaTimes
} from 'react-icons/fa';
import './Auditor.css';

const AuditorRiskAssessment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedVuln, setSelectedVuln] = useState(null);

    // STATE UNTUK FORM (DIPISAH AGAR RINGAN)
    const [formName, setFormName] = useState('');
    const [formAsset, setFormAsset] = useState('');
    const [formCvss, setFormCvss] = useState('5.0');
    const [formDesc, setFormDesc] = useState('');
    const [formCategory, setFormCategory] = useState('Injection');
    const [formLikelihood, setFormLikelihood] = useState('Medium');
    const [formImpact, setFormImpact] = useState('Medium');

    // DATA VULNERABILITIES
    const [vulnerabilities, setVulnerabilities] = useState([
        {
            id: 1,
            name: 'SQL Injection',
            category: 'Injection',
            asset: 'Web Server',
            cvss: 9.0,
            risk: 'Critical',
            status: 'open',
            discovered: '2024-02-15',
            likelihood: 'High',
            impact: 'Critical',
            description: 'Attacker can execute arbitrary SQL queries'
        },
        {
            id: 2,
            name: 'Weak Password Policy',
            category: 'Broken Authentication',
            asset: 'HR System',
            cvss: 7.5,
            risk: 'High',
            status: 'in-progress',
            discovered: '2024-02-10',
            likelihood: 'High',
            impact: 'High',
            description: 'Password policy does not enforce complexity'
        },
        {
            id: 3,
            name: 'XSS Vulnerability',
            category: 'Cross-Site Attacks',
            asset: 'Customer Portal',
            cvss: 6.5,
            risk: 'Medium',
            status: 'open',
            discovered: '2024-02-12',
            likelihood: 'Medium',
            impact: 'Medium',
            description: 'Malicious scripts can be injected'
        },
        {
            id: 4,
            name: 'Missing HTTPS',
            category: 'Sensitive Data Exposure',
            asset: 'API Gateway',
            cvss: 8.5,
            risk: 'Critical',
            status: 'open',
            discovered: '2024-02-18',
            likelihood: 'High',
            impact: 'Critical',
            description: 'Data transmitted without encryption'
        }
    ]);

    // HITUNG RISK MATRIX
    const riskMatrix = {
        critical: vulnerabilities.filter(v => v.risk === 'Critical').length,
        high: vulnerabilities.filter(v => v.risk === 'High').length,
        medium: vulnerabilities.filter(v => v.risk === 'Medium').length,
        low: vulnerabilities.filter(v => v.risk === 'Low').length
    };

    // FILTER VULNERABILITIES
    const filteredVulns = vulnerabilities.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.asset.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRisk === 'all' || v.risk.toLowerCase() === filterRisk.toLowerCase();
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
        setFormAsset('');
        setFormCvss('5.0');
        setFormDesc('');
        setFormCategory('Injection');
        setFormLikelihood('Medium');
        setFormImpact('Medium');
    };

    // HANDLE ADD
    const handleAddVuln = (e) => {
        e.preventDefault();
        
        const risk = calculateRisk(formLikelihood, formImpact);
        
        const vulnToAdd = {
            id: vulnerabilities.length + 1,
            name: formName,
            category: formCategory,
            asset: formAsset,
            cvss: parseFloat(formCvss),
            risk: risk,
            status: 'open',
            discovered: new Date().toISOString().split('T')[0],
            likelihood: formLikelihood,
            impact: formImpact,
            description: formDesc
        };
        
        setVulnerabilities([...vulnerabilities, vulnToAdd]);
        setShowAddModal(false);
        resetForm();
    };

    // HANDLE DELETE
    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this vulnerability?')) {
            setVulnerabilities(vulnerabilities.filter(v => v.id !== id));
        }
    };

    // HANDLE VIEW DETAIL
    const handleViewDetail = (vuln) => {
        setSelectedVuln(vuln);
        setShowDetailModal(true);
    };

    // GET RISK COLOR
    const getRiskColor = (risk) => {
        switch(risk.toLowerCase()) {
            case 'critical': return '#b91c1c';
            case 'high': return '#b45309';
            case 'medium': return '#b68b40';
            default: return '#166534';
        }
    };

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
                                    <td><strong>{v.name}</strong></td>
                                    <td>{v.category}</td>
                                    <td>{v.asset}</td>
                                    <td>{v.cvss}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            background: `${getRiskColor(v.risk)}20`,
                                            color: getRiskColor(v.risk)
                                        }}>
                                            {v.risk}
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
                                {/* NAME - BISA NGETIK */}
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

                                {/* CATEGORY - DROPDOWN */}
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                        <option value="Injection">Injection</option>
                                        <option value="Broken Authentication">Broken Authentication</option>
                                        <option value="Sensitive Data Exposure">Sensitive Data Exposure</option>
                                        <option value="Cross-Site Attacks">Cross-Site Attacks</option>
                                    </select>
                                </div>

                                {/* ASSET - BISA NGETIK */}
                                <div className="form-group">
                                    <label>Asset *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formAsset}
                                        onChange={(e) => setFormAsset(e.target.value)}
                                        placeholder="e.g., Web Server"
                                    />
                                </div>

                                <div className="form-row">
                                    {/* LIKELIHOOD - DROPDOWN */}
                                    <div className="form-group">
                                        <label>Likelihood</label>
                                        <select value={formLikelihood} onChange={(e) => setFormLikelihood(e.target.value)}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>

                                    {/* IMPACT - DROPDOWN */}
                                    <div className="form-group">
                                        <label>Impact</label>
                                        <select value={formImpact} onChange={(e) => setFormImpact(e.target.value)}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>

                                    {/* CVSS - BISA NGETIK ANGKA */}
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

                                {/* DESCRIPTION - BISA NGETIK PANJANG */}
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows="3"
                                        value={formDesc}
                                        onChange={(e) => setFormDesc(e.target.value)}
                                        placeholder="Describe the vulnerability..."
                                    />
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
                                <h3><FaBug /> {selectedVuln.name}</h3>
                                <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
                            </div>
                            
                            <div className="modal-body">
                                <p><strong>Category:</strong> {selectedVuln.category}</p>
                                <p><strong>Asset:</strong> {selectedVuln.asset}</p>
                                <p><strong>Risk:</strong> {selectedVuln.risk}</p>
                                <p><strong>CVSS:</strong> {selectedVuln.cvss}</p>
                                <p><strong>Description:</strong> {selectedVuln.description}</p>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AuditorRiskAssessment;