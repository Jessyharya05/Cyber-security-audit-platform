// src/components/auditee/AuditeeDashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaBuilding, 
  FaServer, 
  FaUpload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaBell,
  FaShieldAlt,
  FaChartBar,
  FaEye,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auditee.css';

const AuditeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk data dari database
  const [companyProfile, setCompanyProfile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [findings, setFindings] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalAssets: 0,
    pendingEvidence: 0,
    openFindings: 0,
    complianceRate: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0
  });

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Upcoming deadlines
  const [deadlines, setDeadlines] = useState([]);

  // Modal state
  const [modalData, setModalData] = useState({ show: false, title: '', items: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Dapatkan company_id dari user (asumsi user punya company_id)
      const companyId = user?.companyId || 1; // Sementara hardcode 1
      
      // 1. Ambil company profile
      const companyRes = await api.get(`/companies/${companyId}`).catch(() => ({ data: null }));
      setCompanyProfile(companyRes.data);
      
      // 2. Ambil assets
      const assetsRes = await api.get(`/assets/company/${companyId}`).catch(() => ({ data: [] }));
      const assetsData = assetsRes.data || [];
      setAssets(assetsData);
      
      // 3. Ambil evidence
      const evidenceRes = await api.get(`/evidence/company/${companyId}`).catch(() => ({ data: [] }));
      const evidenceData = evidenceRes.data || [];
      setEvidence(evidenceData);
      
      // 4. Ambil findings
      const findingsRes = await api.get(`/findings/company/${companyId}`).catch(() => ({ data: [] }));
      const findingsData = findingsRes.data || [];
      setFindings(findingsData);

      // Hitung stats
      const pendingEvidence = evidenceData.filter(e => e.status === 'pending').length;
      const openFindings = findingsData.filter(f => f.status === 'open').length;
      const criticalFindings = findingsData.filter(f => f.severity === 'critical').length;
      const highFindings = findingsData.filter(f => f.severity === 'high').length;
      const mediumFindings = findingsData.filter(f => f.severity === 'medium').length;
      const lowFindings = findingsData.filter(f => f.severity === 'low').length;
      
      // Hitung compliance rate (simulasi)
      const complianceRate = Math.floor(Math.random() * 30) + 60;

      setStats({
        totalAssets: assetsData.length,
        pendingEvidence,
        openFindings,
        complianceRate,
        criticalFindings,
        highFindings,
        mediumFindings,
        lowFindings
      });

      // Set deadlines dari evidence
      const upcomingDeadlines = evidenceData
        .filter(e => e.status === 'pending' && e.due_date)
        .slice(0, 3)
        .map(e => ({
          id: e.id,
          task: e.control,
          due: e.due_date,
          daysLeft: calculateDaysLeft(e.due_date),
          priority: e.priority || 'medium'
        }));
      setDeadlines(upcomingDeadlines);

      // Set recent activities
      const activities = evidenceData.slice(0, 4).map(e => ({
        id: e.id,
        action: 'Evidence uploaded',
        item: e.control,
        time: formatTimeAgo(e.uploaded_at),
        status: e.status === 'uploaded' ? 'completed' : 'pending'
      }));
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Handle stat click
  const handleStatClick = (type) => {
    let title = '';
    let items = [];

    switch(type) {
      case 'assets':
        title = 'All Assets';
        items = assets;
        break;
      case 'evidence':
        title = 'Pending Evidence';
        items = evidence.filter(e => e.status === 'pending');
        break;
      case 'findings':
        title = 'Open Findings';
        items = findings.filter(f => f.status === 'open');
        break;
      case 'compliance':
        title = 'Compliance Overview';
        items = [{ compliance: `${stats.complianceRate}%`, assets: stats.totalAssets, findings: stats.openFindings }];
        break;
      default:
        return;
    }

    setModalData({ show: true, title, items });
  };

  // Handle row click
  const handleRowClick = (item) => {
    setModalData({ show: true, title: 'Details', items: [item] });
  };

  // Modal component
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

  if (loading) {
    return (
      <DashboardLayout role="auditee">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Company Dashboard</h1>
            <p>Welcome back, {companyProfile?.name || user?.name || 'User'}! Manage your assets and audit evidence.</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search assets, evidence..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards - Bisa diklik */}
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={() => handleStatClick('assets')}>
            <div className="stat-icon blue"><FaServer /></div>
            <div className="stat-content">
              <h3>{stats.totalAssets}</h3>
              <p>Total Assets</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +{assets.filter(a => a.status === 'active').length}</div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('evidence')}>
            <div className="stat-icon orange"><FaUpload /></div>
            <div className="stat-content">
              <h3>{stats.pendingEvidence}</h3>
              <p>Evidence Pending</p>
            </div>
            <div className="stat-trend down"><FaArrowDown /> -{evidence.filter(e => e.status === 'uploaded').length}</div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('findings')}>
            <div className="stat-icon red"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{stats.openFindings}</h3>
              <p>Open Findings</p>
            </div>
            <div className="stat-trend">{stats.criticalFindings} critical</div>
          </div>

          <div className="stat-card clickable" onClick={() => handleStatClick('compliance')}>
            <div className="stat-icon green"><FaShieldAlt /></div>
            <div className="stat-content">
              <h3>{stats.complianceRate}%</h3>
              <p>Compliance Rate</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +5%</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* NIST CSF Compliance Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaChartBar /> NIST CSF Compliance</h3>
              <a href="/auditee/reports" className="view-all">View Report →</a>
            </div>
            <div className="compliance-bars">
              <div className="compliance-item">
                <span className="compliance-label">Identify</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '68%'}}></div>
                </div>
                <span className="compliance-value">68%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Protect</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '72%'}}></div>
                </div>
                <span className="compliance-value">72%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Detect</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '45%'}}></div>
                </div>
                <span className="compliance-value">45%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Respond</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '80%'}}></div>
                </div>
                <span className="compliance-value">80%</span>
              </div>
              <div className="compliance-item">
                <span className="compliance-label">Recover</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '55%'}}></div>
                </div>
                <span className="compliance-value">55%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClock /> Upcoming Deadlines</h3>
              <a href="/auditee/evidence" className="view-all">View All →</a>
            </div>
            <div className="deadline-list">
              {deadlines.length > 0 ? deadlines.map(deadline => (
                <div key={deadline.id} className="deadline-item" onClick={() => handleRowClick(deadline)}>
                  <div className="deadline-info">
                    <h4>{deadline.task}</h4>
                    <p>Due: {deadline.due}</p>
                  </div>
                  <div className="deadline-meta">
                    <span className={`priority-badge ${deadline.priority}`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              )) : <p className="no-data">No upcoming deadlines</p>}
            </div>
          </div>
        </div>

        {/* Second Grid */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBell /> Recent Activities</h3>
            </div>
            <div className="activity-list">
              {recentActivities.length > 0 ? recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.status}`}></div>
                  <div className="activity-content">
                    <h4>{activity.action}</h4>
                    <p>{activity.item}</p>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              )) : <p className="no-data">No recent activities</p>}
            </div>
          </div>

          {/* Findings Summary */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaExclamationTriangle /> Findings by Severity</h3>
              <a href="/auditee/findings" className="view-all">View All →</a>
            </div>
            <div className="findings-summary">
              <div className="finding-stat">
                <span className="finding-label">Critical</span>
                <span className="finding-value">{stats.criticalFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill critical" style={{width: `${(stats.criticalFindings / (stats.criticalFindings + stats.highFindings + stats.mediumFindings + stats.lowFindings || 1)) * 100}%`}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">High</span>
                <span className="finding-value">{stats.highFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill high" style={{width: `${(stats.highFindings / (stats.criticalFindings + stats.highFindings + stats.mediumFindings + stats.lowFindings || 1)) * 100}%`}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">Medium</span>
                <span className="finding-value">{stats.mediumFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill medium" style={{width: `${(stats.mediumFindings / (stats.criticalFindings + stats.highFindings + stats.mediumFindings + stats.lowFindings || 1)) * 100}%`}}></div>
                </div>
              </div>
              <div className="finding-stat">
                <span className="finding-label">Low</span>
                <span className="finding-value">{stats.lowFindings}</span>
                <div className="progress-bar">
                  <div className="progress-fill low" style={{width: `${(stats.lowFindings / (stats.criticalFindings + stats.highFindings + stats.mediumFindings + stats.lowFindings || 1)) * 100}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <DetailModal />
      </div>
    </DashboardLayout>
  );
};

export default AuditeeDashboard;