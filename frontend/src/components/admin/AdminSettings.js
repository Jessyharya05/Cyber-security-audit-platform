// src/components/admin/AdminSettings.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaCog, 
  FaShieldAlt, 
  FaBell, 
  FaLock,
  FaGlobe,
  FaEnvelope,
  FaSave,
  FaPalette,
  FaLanguage,
  FaDesktop,
  FaUserShield,
  FaHistory,
  FaEye,
  FaSlidersH
} from 'react-icons/fa';
import './Admin.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'CyberGuard',
    siteUrl: 'https://cyberguard.com',
    adminEmail: 'admin@cyberguard.com',
    language: 'English',
    
    // Security Settings
    mfaRequired: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    auditAlerts: true,
    findingAlerts: true,
    reportNotifications: false,
    
    // Audit Settings
    defaultFramework: 'NIST CSF 2.0',
    autoReminders: true,
    reminderDays: 7,
    
    // Appearance
    theme: 'light',
    sidebarCollapsed: false
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header - Sesuai gambar */}
        <div className="page-header">
          <div>
            <h2><FaCog /> System Settings</h2>
            <p className="header-subtitle">Configure platform settings and preferences</p>
          </div>
          <button className="btn-primary" onClick={handleSave}>
            <FaSave /> Save Changes
          </button>
        </div>

        {/* Settings Tabs - Sesuai gambar */}
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaGlobe /> General
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Security
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell /> Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <FaShieldAlt /> Audit
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <FaPalette /> Appearance
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings - Sesuai gambar */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Site Name</label>
                  <div className="setting-value">
                    <input
                      type="text"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleChange}
                      placeholder="CyberGuard"
                    />
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Site URL</label>
                  <div className="setting-value">
                    <input
                      type="url"
                      name="siteUrl"
                      value={settings.siteUrl}
                      onChange={handleChange}
                      placeholder="https://cyberguard.com"
                    />
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Admin Email</label>
                  <div className="setting-value">
                    <input
                      type="email"
                      name="adminEmail"
                      value={settings.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@cyberguard.com"
                    />
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Language</label>
                  <div className="setting-value">
                    <select name="language" value={settings.language} onChange={handleChange}>
                      <option value="English">English</option>
                      <option value="Indonesian">Indonesian</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item toggle">
                  <label>Multi-Factor Authentication</label>
                  <button 
                    className={`toggle-btn ${settings.mfaRequired ? 'active' : ''}`}
                    onClick={() => handleToggle('mfaRequired')}
                  >
                    {settings.mfaRequired ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="setting-item">
                  <label>Password Expiry (days)</label>
                  <input
                    type="number"
                    name="passwordExpiry"
                    value={settings.passwordExpiry}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="setting-item">
                  <label>Max Login Attempts</label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    value={settings.maxLoginAttempts}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item toggle">
                  <label>Email Notifications</label>
                  <button 
                    className={`toggle-btn ${settings.emailNotifications ? 'active' : ''}`}
                    onClick={() => handleToggle('emailNotifications')}
                  >
                    {settings.emailNotifications ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="setting-item toggle">
                  <label>Audit Alerts</label>
                  <button 
                    className={`toggle-btn ${settings.auditAlerts ? 'active' : ''}`}
                    onClick={() => handleToggle('auditAlerts')}
                  >
                    {settings.auditAlerts ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="setting-item toggle">
                  <label>Finding Alerts</label>
                  <button 
                    className={`toggle-btn ${settings.findingAlerts ? 'active' : ''}`}
                    onClick={() => handleToggle('findingAlerts')}
                  >
                    {settings.findingAlerts ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="setting-item toggle">
                  <label>Report Notifications</label>
                  <button 
                    className={`toggle-btn ${settings.reportNotifications ? 'active' : ''}`}
                    onClick={() => handleToggle('reportNotifications')}
                  >
                    {settings.reportNotifications ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audit Settings */}
          {activeTab === 'audit' && (
            <div className="settings-section">
              <h3>Audit Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Default Framework</label>
                  <select name="defaultFramework" value={settings.defaultFramework} onChange={handleChange}>
                    <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                    <option value="ISO 27001">ISO 27001</option>
                    <option value="COBIT">COBIT</option>
                  </select>
                </div>
                
                <div className="setting-item toggle">
                  <label>Auto Reminders</label>
                  <button 
                    className={`toggle-btn ${settings.autoReminders ? 'active' : ''}`}
                    onClick={() => handleToggle('autoReminders')}
                  >
                    {settings.autoReminders ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <div className="setting-item">
                  <label>Reminder Days Before Due</label>
                  <input
                    type="number"
                    name="reminderDays"
                    value={settings.reminderDays}
                    onChange={handleChange}
                    disabled={!settings.autoReminders}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Theme</label>
                  <select name="theme" value={settings.theme} onChange={handleChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div className="setting-item toggle">
                  <label>Collapse Sidebar by Default</label>
                  <button 
                    className={`toggle-btn ${settings.sidebarCollapsed ? 'active' : ''}`}
                    onClick={() => handleToggle('sidebarCollapsed')}
                  >
                    {settings.sidebarCollapsed ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              
              <div className="theme-preview">
                <div className="preview-light">
                  <FaDesktop /> Light Theme Preview
                </div>
                <div className="preview-dark">
                  <FaEye /> Dark Theme Preview
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;