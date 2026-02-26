// ============================================
// src/components/admin/AdminDashboard.js
// ============================================
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaUsers, 
  FaBuilding,
  FaClipboardList,
  FaChartBar,
  FaUserTie,
  FaUserCheck,
  FaShieldAlt,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaFileAlt,
  FaBell,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaShare
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk stats
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    totalAuditors: 0,
    activeAudits: 0,
    completedAudits: 0,
    complianceRate: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0
  });

  // Data untuk ditampilkan di komponen tambahan
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAudits, setUpcomingAudits] = useState([]);
  const [topAuditors, setTopAuditors] = useState([]);
  
  // State untuk modal
  const [modalData, setModalData] = useState({
    show: false,
    title: '',
    items: []
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Fetching dashboard data...');
      
      const [companiesRes, usersRes, auditsRes, findingsRes] = await Promise.all([
        api.get('/companies/').catch(() => ({ data: [] })),
        api.get('/users/').catch(() => ({ data: [] })),
        api.get('/audit/').catch(() => ({ data: [] })),
        api.get('/findings/').catch(() => ({ data: [] }))
      ]);

      const companies = companiesRes.data || [];
      const users = usersRes.data || [];
      const audits = auditsRes.data || [];
      const findings = findingsRes.data || [];

      const auditors = users.filter(u => u.role === 'auditor');
      const activeAudits = audits.filter(a => a.status === 'in-progress' || a.status === 'pending');
      const completedAudits = audits.filter(a => a.status === 'completed');
      
      const criticalFindings = findings.filter(f => f.severity === 'critical');
      const highFindings = findings.filter(f => f.severity === 'high');
      const mediumFindings = findings.filter(f => f.severity === 'medium');
      const lowFindings = findings.filter(f => f.severity === 'low');

      const totalCompliance = companies.reduce((sum, c) => sum + (c.compliance || 0), 0);
      const avgCompliance = companies.length ? Math.round(totalCompliance / companies.length) : 0;

      setStats({
        totalCompanies: companies.length,
        totalUsers: users.length,
        totalAuditors: auditors.length,
        activeAudits: activeAudits.length,
        completedAudits: completedAudits.length,
        complianceRate: avgCompliance,
        criticalFindings: criticalFindings.length,
        highFindings: highFindings.length,
        mediumFindings: mediumFindings.length,
        lowFindings: lowFindings.length
      });

      // ===== SET DATA UNTUK RECENT COMPANIES =====
      setRecentCompanies(companies.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name || 'Unknown Company',
        compliance: c.compliance || Math.floor(Math.random() * 30) + 60,
        status: c.status || 'active',
        findings: findings.filter(f => f.company_id === c.id).length
      })));

      // ===== SET DATA UNTUK UPCOMING AUDITS =====
      const now = new Date();
      const upcoming = audits
        .filter(a => a.status !== 'completed' && a.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3)
        .map(a => ({
          id: a.id,
          company: a.companyName || 'Company',
          auditor: a.auditorName || 'Auditor',
          dueDate: a.dueDate || 'No date',
          priority: a.priority || 'medium'
        }));
      setUpcomingAudits(upcoming);

      // ===== SET DATA UNTUK TOP AUDITORS =====
      const auditorStats = auditors.map(a => ({
        id: a.id,
        name: a.name || 'Unknown Auditor',
        completed: audits.filter(ad => ad.auditorId === a.id && ad.status === 'completed').length,
        rating: a.rating || 4.5
      })).sort((a, b) => b.completed - a.completed).slice(0, 3);
      setTopAuditors(auditorStats);

      // ===== SET DATA UNTUK RECENT ACTIVITIES =====
      const activities = [
        ...companies.slice(0, 2).map(c => ({ 
          id: `c-${c.id}`, 
          action: 'New company registered', 
          company: c.name || 'Company', 
          time: 'Today', 
          type: 'register' 
        })),
        ...audits.slice(0, 2).map(a => ({ 
          id: `a-${a.id}`, 
          action: 'Audit completed', 
          company: a.companyName || 'Company', 
          time: 'Yesterday', 
          type: 'audit' 
        }))
      ];
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE KLIK STATS ==========
  const handleStatClick = (type) => {
    console.log('🔥 Card clicked:', type);
    
    let title = '';
    let items = [];

    switch(type) {
      case 'companies':
        title = 'Companies Overview';
        items = [{ name: 'Loading...' }];
        api.get('/companies/')
          .then(res => setModalData({ show: true, title, items: res.data || [] }))
          .catch(err => {
            console.error(err);
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No companies data available', status: 'info' }] 
            });
          });
        break;
        
      case 'users':
        title = 'Users Overview';
        items = [{ name: 'Loading...' }];
        api.get('/users/')
          .then(res => setModalData({ show: true, title, items: res.data || [] }))
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No users data available', status: 'info' }] 
            });
          });
        break;
        
      case 'auditors':
        title = 'Auditors Overview';
        items = [{ name: 'Loading...' }];
        api.get('/users/')
          .then(res => {
            const auditors = res.data?.filter(u => u.role === 'auditor') || [];
            setModalData({ show: true, title, items: auditors.length ? auditors : [{ message: 'No auditors found', status: 'info' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No auditors data available', status: 'info' }] 
            });
          });
        break;
        
      case 'audits':
        title = 'Active Audits';
        items = [{ name: 'Loading...' }];
        api.get('/audit/')
          .then(res => {
            const activeAudits = res.data?.filter(a => a.status === 'in-progress' || a.status === 'pending') || [];
            setModalData({ show: true, title, items: activeAudits.length ? activeAudits : [{ message: 'No active audits', status: 'info' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No audit data available', status: 'info' }] 
            });
          });
        break;
        
      case 'critical':
        title = 'Critical Findings';
        items = [{ name: 'Loading...' }];
        api.get('/findings/')
          .then(res => {
            const critical = res.data?.filter(f => f.severity?.toLowerCase() === 'critical') || [];
            setModalData({ show: true, title, items: critical.length ? critical : [{ message: 'No critical findings', status: 'success' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'Findings module not ready', status: 'warning' }] 
            });
          });
        break;
        
      case 'high':
        title = 'High Findings';
        items = [{ name: 'Loading...' }];
        api.get('/findings/')
          .then(res => {
            const high = res.data?.filter(f => f.severity?.toLowerCase() === 'high') || [];
            setModalData({ show: true, title, items: high.length ? high : [{ message: 'No high findings', status: 'success' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'Findings module not ready', status: 'warning' }] 
            });
          });
        break;
        
      case 'medium':
        title = 'Medium Findings';
        items = [{ name: 'Loading...' }];
        api.get('/findings/')
          .then(res => {
            const medium = res.data?.filter(f => f.severity?.toLowerCase() === 'medium') || [];
            setModalData({ show: true, title, items: medium.length ? medium : [{ message: 'No medium findings', status: 'success' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'Findings module not ready', status: 'warning' }] 
            });
          });
        break;
        
      case 'low':
        title = 'Low Findings';
        items = [{ name: 'Loading...' }];
        api.get('/findings/')
          .then(res => {
            const low = res.data?.filter(f => f.severity?.toLowerCase() === 'low') || [];
            setModalData({ show: true, title, items: low.length ? low : [{ message: 'No low findings', status: 'success' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'Findings module not ready', status: 'warning' }] 
            });
          });
        break;
        
      case 'completed':
        title = 'Completed Audits';
        items = [{ name: 'Loading...' }];
        api.get('/audit/')
          .then(res => {
            const completed = res.data?.filter(a => a.status === 'completed') || [];
            setModalData({ show: true, title, items: completed.length ? completed : [{ message: 'No completed audits', status: 'info' }] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No audit data available', status: 'info' }] 
            });
          });
        break;
        
      case 'compliance':
        title = 'Compliance Overview';
        items = [{ name: 'Loading...' }];
        api.get('/companies/')
          .then(res => {
            setModalData({ show: true, title, items: res.data || [] });
          })
          .catch(err => {
            setModalData({ 
              show: true, 
              title, 
              items: [{ message: 'No compliance data available', status: 'info' }] 
            });
          });
        break;
        
      default:
        return;
    }
    
    // Tampilkan modal loading dulu
    setModalData({ show: true, title, items });
  };

  // ========== HANDLE KLIK BARIS DI MODAL ==========
  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // ========== HANDLE DOWNLOAD ==========
  const handleDownload = (item, e) => {
    e.stopPropagation();
    alert(`📥 Downloading data for ${item.name || item.company || 'item'} (Demo mode)`);
  };

  // ========== HANDLE PRINT ==========
  const handlePrint = (item, e) => {
    e.stopPropagation();
    alert(`🖨️ Printing data for ${item.name || item.company || 'item'} (Demo mode)`);
  };

  // ========== HANDLE SHARE ==========
  const handleShare = (item, e) => {
    e.stopPropagation();
    alert(`🔗 Share link copied for ${item.name || item.company || 'item'} (Demo mode)`);
  };

  // ========== MODAL STATS ==========
  const StatsModal = () => {
    if (!modalData.show) return null;

    return (
      <div className="modal-overlay" onClick={() => setModalData({...modalData, show: false})}>
        <div className="modal-content large" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaChartBar /> {modalData.title}</h3>
            <button className="close-btn" onClick={() => setModalData({...modalData, show: false})}>
              <FaTimes />
            </button>
          </div>
          
          <div className="modal-body">
            {modalData.items.length === 0 ? (
              <p className="no-data">No data available</p>
            ) : (
              <>
                {modalData.items[0].message ? (
                  <div className={`status-message ${modalData.items[0].status || 'info'}`}>
                    {modalData.items[0].message}
                    {modalData.items[0].status === 'warning' && (
                      <p style={{ marginTop: '10px', fontSize: '14px' }}>
                        This feature is under development by Developer C
                      </p>
                    )}
                  </div>
                ) : (
                  <table className="detail-table">
                    <thead>
                      <tr>
                        {Object.keys(modalData.items[0]).map(key => (
                          <th key={key}>{key.toUpperCase()}</th>
                        ))}
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalData.items.map((item, idx) => (
                        <tr key={idx} className="clickable-row" onClick={() => handleRowClick(item)}>
                          {Object.values(item).map((val, i) => (
                            <td key={i}>
                              {typeof val === 'object' ? JSON.stringify(val) : val?.toString() || '-'}
                            </td>
                          ))}
                          <td onClick={(e) => e.stopPropagation()}>
                            <button className="icon-btn" onClick={() => handleRowClick(item)} title="View Details">
                              <FaEye />
                            </button>
                            <button className="icon-btn" onClick={(e) => handleDownload(item, e)} title="Download">
                              <FaDownload />
                            </button>
                            <button className="icon-btn" onClick={(e) => handlePrint(item, e)} title="Print">
                              <FaPrint />
                            </button>
                            <button className="icon-btn" onClick={(e) => handleShare(item, e)} title="Share">
                              <FaShare />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== MODAL DETAIL ==========
  const DetailModal = () => {
    if (!showDetailModal || !selectedItem) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FaEye /> Detail Information</h3>
            <button className="close-btn" onClick={() => setShowDetailModal(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="detail-grid">
              {Object.entries(selectedItem).map(([key, value]) => (
                <div key={key} className="detail-row">
                  <label>{key.toUpperCase()}:</label>
                  <span>{typeof value === 'object' ? JSON.stringify(value) : value?.toString() || '-'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
            <button className="btn-primary" onClick={(e) => handleDownload(selectedItem, e)}>
              <FaDownload /> Download
            </button>
            <button className="btn-primary" onClick={(e) => handlePrint(selectedItem, e)}>
              <FaPrint /> Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="admin-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {user?.name || 'Admin'}! Here's what's happening.</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* STATS CARDS - SEMUA BISA DI KLIK */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => handleStatClick('companies')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon blue"><FaBuilding /></div>
            <div className="stat-content">
              <h3>{stats.totalCompanies}</h3>
              <p>Total Companies</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +12.5%</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('users')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon green"><FaUsers /></div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +8.2%</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('auditors')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon purple"><FaUserTie /></div>
            <div className="stat-content">
              <h3>{stats.totalAuditors}</h3>
              <p>Active Auditors</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +2</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('audits')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon orange"><FaClipboardList /></div>
            <div className="stat-content">
              <h3>{stats.activeAudits}</h3>
              <p>Active Audits</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +2</div>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="stats-grid secondary">
          <div className="stat-card" onClick={() => handleStatClick('critical')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon red"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{stats.criticalFindings}</h3>
              <p>Critical Findings</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +3</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('high')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon yellow"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{stats.highFindings}</h3>
              <p>High Findings</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +5</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('medium')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon orange"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{stats.mediumFindings}</h3>
              <p>Medium Findings</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +4</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('low')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon blue"><FaExclamationTriangle /></div>
            <div className="stat-content">
              <h3>{stats.lowFindings}</h3>
              <p>Low Findings</p>
            </div>
            <div className="stat-trend down"><FaArrowDown /> -2</div>
          </div>
        </div>

        {/* Third Row Stats */}
        <div className="stats-grid tertiary">
          <div className="stat-card" onClick={() => handleStatClick('completed')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon green"><FaCheckCircle /></div>
            <div className="stat-content">
              <h3>{stats.completedAudits}</h3>
              <p>Completed Audits</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +8</div>
          </div>

          <div className="stat-card" onClick={() => handleStatClick('compliance')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon purple"><FaChartBar /></div>
            <div className="stat-content">
              <h3>{stats.complianceRate}%</h3>
              <p>Avg Compliance</p>
            </div>
            <div className="stat-trend up"><FaArrowUp /> +5.2%</div>
          </div>

          <div className="stat-card" style={{ visibility: 'hidden' }}></div>
          <div className="stat-card" style={{ visibility: 'hidden' }}></div>
        </div>

        {/* ===== MAIN DASHBOARD GRID - RECENT COMPANIES & UPCOMING AUDITS ===== */}
        <div className="dashboard-grid">
          {/* Recent Companies */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBuilding /> Recent Companies</h3>
              <a href="/admin/companies" className="view-all">View All →</a>
            </div>
            <div className="company-list">
              {recentCompanies.length > 0 ? (
                recentCompanies.map(company => (
                  <div key={company.id} className="company-item" onClick={() => handleRowClick(company)}>
                    <div className="company-info">
                      <h4>{company.name}</h4>
                      <div className="company-meta">
                        <span className={`status-badge ${company.status}`}>
                          {company.status}
                        </span>
                        <span className="findings">{company.findings} findings</span>
                      </div>
                    </div>
                    <div className="company-compliance">
                      <div className="progress-circle">
                        <svg viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray={`${company.compliance}, 100`}/>
                        </svg>
                        <span>{company.compliance}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent companies</p>
              )}
            </div>
          </div>

          {/* Upcoming Audits */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaClock /> Upcoming Audits</h3>
              <a href="/admin/audits" className="view-all">View All →</a>
            </div>
            <div className="upcoming-list">
              {upcomingAudits.length > 0 ? (
                upcomingAudits.map(audit => (
                  <div key={audit.id} className="upcoming-item" onClick={() => handleRowClick(audit)}>
                    <div className="audit-info">
                      <h4>{audit.company}</h4>
                      <p>{audit.auditor}</p>
                    </div>
                    <div className="audit-meta">
                      <span className={`priority-badge ${audit.priority}`}>
                        {audit.priority}
                      </span>
                      <span className="due-date"><FaCalendarAlt /> {audit.dueDate}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No upcoming audits</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== SECOND GRID ROW - RECENT ACTIVITIES & TOP AUDITORS ===== */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaBell /> Recent Activities</h3>
            </div>
            <div className="activity-list">
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}></div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.action}</p>
                      <p className="activity-meta">{activity.company}</p>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent activities</p>
              )}
            </div>
          </div>

          {/* Top Auditors */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><FaUserTie /> Top Auditors</h3>
              <a href="/admin/auditors" className="view-all">View All →</a>
            </div>
            <div className="auditor-list">
              {topAuditors.length > 0 ? (
                topAuditors.map(auditor => (
                  <div key={auditor.id} className="auditor-item" onClick={() => handleRowClick(auditor)}>
                    <div className="auditor-avatar">
                      {auditor.name?.charAt(0) || 'A'}
                    </div>
                    <div className="auditor-info">
                      <h4>{auditor.name}</h4>
                      <p>{auditor.completed} audits completed</p>
                    </div>
                    <div className="auditor-rating">
                      <span className="rating">{auditor.rating}</span>
                      <span className="star">★</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No top auditors</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== FINDINGS DISTRIBUTION ===== */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3><FaChartBar /> Findings Distribution</h3>
            <a href="/admin/reports" className="view-all">View Report →</a>
          </div>
          <div className="findings-distribution">
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

        {/* MODALS */}
        <StatsModal />
        <DetailModal />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;