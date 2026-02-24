// src/components/layout/DashboardLayout.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaHome,
  FaServer, 
  FaClipboardCheck, 
  FaRobot,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaUser,
  FaBars,
  FaUpload,
  FaExclamationTriangle,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaUserCheck,
  FaCrown,
  FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AIAssistantBubble from '../ai/AIAssistantBubble';
import './DashboardLayout.css';

const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Menu berdasarkan role
  const menuItems = {
    admin: [
      { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
      { path: '/admin/companies', icon: <FaBuilding />, label: 'Companies' },
      { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
      { path: '/admin/auditors', icon: <FaUserTie />, label: 'Auditors' },
      { path: '/admin/audits', icon: <FaClipboardCheck />, label: 'Audits' },
      { path: '/admin/reports', icon: <FaFileAlt />, label: 'Reports' },
      { path: '/admin/settings', icon: <FaCog />, label: 'Settings' }
    ],
    auditor: [
      { path: '/auditor/dashboard', icon: <FaHome />, label: 'Dashboard' },
      { path: '/auditor/risk-assessment', icon: <FaExclamationTriangle />, label: 'Risk Assessment' },
      { path: '/auditor/checklist', icon: <FaClipboardCheck />, label: 'Audit Checklist' },
      { path: '/auditor/ai-assistant', icon: <FaRobot />, label: 'AI Assistant' },
      { path: '/auditor/reports', icon: <FaFileAlt />, label: 'Reports' }
    ],
    auditee: [
      { path: '/auditee/dashboard', icon: <FaHome />, label: 'Dashboard' },
      { path: '/auditee/profile', icon: <FaBuilding />, label: 'Company Profile' },
      { path: '/auditee/assets', icon: <FaServer />, label: 'Assets' },
      { path: '/auditee/evidence', icon: <FaUpload />, label: 'Evidence' },
      { path: '/auditee/findings', icon: <FaExclamationTriangle />, label: 'Findings' },
      { path: '/auditee/reports', icon: <FaFileAlt />, label: 'Reports' }
    ]
  };

  const currentMenu = menuItems[role] || menuItems.auditee;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'admin': return <FaCrown />;
      case 'auditor': return <FaUserTie />;
      default: return <FaUserCheck />;
    }
  };

  const getRoleName = () => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'auditor': return 'Auditor';
      default: return 'Company Representative';
    }
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* SIDEBAR - INI YANG LENGKAP */}
      <aside className="dashboard-sidebar">
        {/* Sidebar Header dengan Logo dan Toggle */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaShieldAlt className="logo-icon" />
            {sidebarOpen && <span className="logo-text">CyberGuard</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        {/* User Info di Sidebar */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{getRoleName()}</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {currentMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-nav-item"
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer dengan Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="main-header">
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="header-user">
              <div className="header-avatar">
                {getRoleIcon()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>

      {/* AI Assistant Bubble */}
      <AIAssistantBubble />
    </div>
  );
};

export default DashboardLayout;