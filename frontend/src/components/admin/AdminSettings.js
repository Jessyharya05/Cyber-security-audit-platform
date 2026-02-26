// ============================================
// src/components/admin/AdminSettings.js
// ============================================
import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaCog, 
  FaShieldAlt, 
  FaBell, 
  FaGlobe,
  FaDatabase,
  FaUsers,
  FaLock,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaServer,
  FaClock,
  FaPalette,
  FaLanguage,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import './Admin.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'CyberGuard GRC Platform',
    siteUrl: 'https://cyberguard.com',
    adminEmail: 'admin@cyberguard.com',
    timezone: 'Asia/Jakarta',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    maintenanceMode: false,
    debugMode: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelist: '',
    allowedDomains: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    auditAlerts: true,
    findingAlerts: true,
    evidenceReminders: true,
    weeklyReport: true,
    monthlyReport: true,
    criticalAlerts: true,
    notifyEmail: 'admin@cyberguard.com',
    notifySlack: '',
    notifyWebhook: ''
  });

  // NIST CSF Settings
  const [nistSettings, setNistSettings] = useState({
    defaultFramework: 'CSF 2.0',
    identifyWeight: 1,
    protectWeight: 1,
    detectWeight: 1,
    respondWeight: 1,
    recoverWeight: 1,
    autoChecklist: true,
    complianceThreshold: 70
  });

  // Database Settings
  const [databaseSettings, setDatabaseSettings] = useState({
    backupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retainBackups: 30,
    autoCleanup: true,
    cleanupAfter: 90
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'noreply@cyberguard.com',
    smtpPassword: '********',
    fromEmail: 'noreply@cyberguard.com',
    fromName: 'CyberGuard System'
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#1e293b',
    accentColor: '#2563eb',
    sidebarCollapsed: false,
    animations: true,
    compactMode: false
  });

  // ========== HANDLE SAVE ==========
  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    console.log('Settings saved:', {
      generalSettings,
      securitySettings,
      notificationSettings,
      nistSettings,
      databaseSettings,
      emailSettings,
      appearanceSettings
    });
  };

  // ========== HANDLE RESET ==========
  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      window.location.reload();
    }
  };

  // ========== TEST EMAIL ==========
  const handleTestEmail = () => {
    alert('Test email sent! (Demo mode)');
  };

  // ========== TEST CONNECTION ==========
  const handleTestConnection = () => {
    alert('Database connection successful! (Demo mode)');
  };

  // ========== BACKUP NOW ==========
  const handleBackupNow = () => {
    alert('Backup started... (Demo mode)');
  };

  // ========== RENDER TAB CONTENT ==========
  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="settings-tab">
            <h3>General Settings</h3>
            
            <div className="settings-section">
              <h4>Site Information</h4>
              <div className="form-group">
                <label>Site Name</label>
                <input 
                  type="text" 
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Site URL</label>
                <input 
                  type="text" 
                  value={generalSettings.siteUrl}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Admin Email</label>
                <input 
                  type="email" 
                  value={generalSettings.adminEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Date & Time</h4>
              <div className="form-group">
                <label>Timezone</label>
                <select 
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date Format</label>
                  <select 
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Time Format</label>
                  <select 
                    value={generalSettings.timeFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, timeFormat: e.target.value})}
                  >
                    <option value="24h">24 Hour</option>
                    <option value="12h">12 Hour (AM/PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h4>System Mode</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  />
                  Maintenance Mode
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={generalSettings.debugMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, debugMode: e.target.checked})}
                  />
                  Debug Mode
                </label>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-tab">
            <h3>Security Settings</h3>
            
            <div className="settings-section">
              <h4>Password Policy</h4>
              <div className="form-group">
                <label>Minimum Password Length</label>
                <input 
                  type="number" 
                  min="6"
                  max="20"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                />
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.passwordRequireUppercase}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                  />
                  Require Uppercase Letters
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.passwordRequireNumbers}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                  />
                  Require Numbers
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.passwordRequireSymbols}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSymbols: e.target.checked})}
                  />
                  Require Symbols
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h4>Session & Login</h4>
              <div className="form-group">
                <label>Session Timeout (minutes)</label>
                <input 
                  type="number" 
                  min="5"
                  max="120"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Max Login Attempts</label>
                  <input 
                    type="number" 
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Lockout Duration (minutes)</label>
                  <input 
                    type="number" 
                    min="5"
                    max="60"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h4>Two-Factor Authentication</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                  />
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h4>IP & Domain Restrictions</h4>
              <div className="form-group">
                <label>IP Whitelist (comma separated)</label>
                <textarea 
                  rows="3"
                  placeholder="192.168.1.1, 10.0.0.1"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Allowed Domains (comma separated)</label>
                <textarea 
                  rows="2"
                  placeholder="cyberguard.com, example.com"
                  value={securitySettings.allowedDomains}
                  onChange={(e) => setSecuritySettings({...securitySettings, allowedDomains: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-tab">
            <h3>Notification Settings</h3>
            
            <div className="settings-section">
              <h4>Email Notifications</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                  />
                  Enable Email Notifications
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.auditAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, auditAlerts: e.target.checked})}
                  />
                  Audit Alerts
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.findingAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, findingAlerts: e.target.checked})}
                  />
                  Finding Alerts
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.evidenceReminders}
                    onChange={(e) => setNotificationSettings({...notificationSettings, evidenceReminders: e.target.checked})}
                  />
                  Evidence Reminders
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.criticalAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, criticalAlerts: e.target.checked})}
                  />
                  Critical Alerts
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h4>Report Notifications</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                // ============================================
// src/components/admin/AdminSettings.js (LANJUTAN)
// ============================================

                  <input 
                    type="checkbox" 
                    checked={notificationSettings.weeklyReport}
                    onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReport: e.target.checked})}
                  />
                  Weekly Report Summary
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.monthlyReport}
                    onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReport: e.target.checked})}
                  />
                  Monthly Report Summary
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h4>Notification Email</h4>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={notificationSettings.notifyEmail}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notifyEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Integrations</h4>
              <div className="form-group">
                <label>Slack Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://hooks.slack.com/services/..."
                  value={notificationSettings.notifySlack}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notifySlack: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Custom Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://api.example.com/webhook"
                  value={notificationSettings.notifyWebhook}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notifyWebhook: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        );

      case 'nist':
        return (
          <div className="settings-tab">
            <h3>NIST CSF Settings</h3>
            
            <div className="settings-section">
              <h4>Framework Configuration</h4>
              <div className="form-group">
                <label>Default Framework Version</label>
                <select 
                  value={nistSettings.defaultFramework}
                  onChange={(e) => setNistSettings({...nistSettings, defaultFramework: e.target.value})}
                >
                  <option value="CSF 1.1">NIST CSF 1.1</option>
                  <option value="CSF 2.0">NIST CSF 2.0</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h4>Function Weights</h4>
              <p className="settings-note">Adjust the importance of each NIST CSF function in compliance scoring</p>
              
              <div className="form-group">
                <label>Identify (ID) Weight</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={nistSettings.identifyWeight}
                  onChange={(e) => setNistSettings({...nistSettings, identifyWeight: parseFloat(e.target.value)})}
                />
                <span className="weight-value">{nistSettings.identifyWeight}x</span>
              </div>

              <div className="form-group">
                <label>Protect (PR) Weight</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={nistSettings.protectWeight}
                  onChange={(e) => setNistSettings({...nistSettings, protectWeight: parseFloat(e.target.value)})}
                />
                <span className="weight-value">{nistSettings.protectWeight}x</span>
              </div>

              <div className="form-group">
                <label>Detect (DE) Weight</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={nistSettings.detectWeight}
                  onChange={(e) => setNistSettings({...nistSettings, detectWeight: parseFloat(e.target.value)})}
                />
                <span className="weight-value">{nistSettings.detectWeight}x</span>
              </div>

              <div className="form-group">
                <label>Respond (RS) Weight</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={nistSettings.respondWeight}
                  onChange={(e) => setNistSettings({...nistSettings, respondWeight: parseFloat(e.target.value)})}
                />
                <span className="weight-value">{nistSettings.respondWeight}x</span>
              </div>

              <div className="form-group">
                <label>Recover (RC) Weight</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={nistSettings.recoverWeight}
                  onChange={(e) => setNistSettings({...nistSettings, recoverWeight: parseFloat(e.target.value)})}
                />
                <span className="weight-value">{nistSettings.recoverWeight}x</span>
              </div>
            </div>

            <div className="settings-section">
              <h4>Compliance Settings</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={nistSettings.autoChecklist}
                    onChange={(e) => setNistSettings({...nistSettings, autoChecklist: e.target.checked})}
                  />
                  Auto-generate Audit Checklist
                </label>
              </div>
              
              <div className="form-group">
                <label>Compliance Threshold (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={nistSettings.complianceThreshold}
                  onChange={(e) => setNistSettings({...nistSettings, complianceThreshold: parseInt(e.target.value)})}
                />
                <small>Minimum percentage to be considered compliant</small>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="settings-tab">
            <h3>Database Settings</h3>
            
            <div className="settings-section">
              <h4>Backup Configuration</h4>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={databaseSettings.backupEnabled}
                    onChange={(e) => setDatabaseSettings({...databaseSettings, backupEnabled: e.target.checked})}
                  />
                  Enable Automatic Backups
                </label>
              </div>

              <div className="form-group">
                <label>Backup Frequency</label>
                <select 
                  value={databaseSettings.backupFrequency}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
                  disabled={!databaseSettings.backupEnabled}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Backup Time</label>
                <input 
                  type="time" 
                  value={databaseSettings.backupTime}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backupTime: e.target.value})}
                  disabled={!databaseSettings.backupEnabled}
                />
              </div>

              <div className="form-group">
                <label>Retain Backups (days)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="365"
                  value={databaseSettings.retainBackups}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, retainBackups: parseInt(e.target.value)})}
                  disabled={!databaseSettings.backupEnabled}
                />
              </div>

              <button className="btn-secondary" onClick={handleBackupNow} disabled={!databaseSettings.backupEnabled}>
                Backup Now
              </button>
            </div>

            <div className="settings-section">
              <h4>Data Retention</h4>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={databaseSettings.autoCleanup}
                    onChange={(e) => setDatabaseSettings({...databaseSettings, autoCleanup: e.target.checked})}
                  />
                  Enable Auto Cleanup
                </label>
              </div>

              <div className="form-group">
                <label>Delete records older than (days)</label>
                <input 
                  type="number" 
                  min="30" 
                  max="3650"
                  value={databaseSettings.cleanupAfter}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, cleanupAfter: parseInt(e.target.value)})}
                  disabled={!databaseSettings.autoCleanup}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Database Status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Size:</span>
                  <span className="status-value">156 MB</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Tables:</span>
                  <span className="status-value">12</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Records:</span>
                  <span className="status-value">1,234</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Backup:</span>
                  <span className="status-value">2024-02-23 02:00</span>
                </div>
              </div>
              
              <button className="btn-secondary" onClick={handleTestConnection}>
                Test Connection
              </button>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="settings-tab">
            <h3>Email Settings</h3>
            
            <div className="settings-section">
              <h4>SMTP Configuration</h4>
              
              <div className="form-group">
                <label>SMTP Host</label>
                <input 
                  type="text" 
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SMTP Port</label>
                  <input 
                    type="number" 
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Encryption</label>
                  <select 
                    value={emailSettings.smtpSecure}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpSecure: e.target.value === 'true'})}
                  >
                    <option value="true">SSL/TLS</option>
                    <option value="false">None</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>SMTP Username</label>
                <input 
                  type="text" 
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>SMTP Password</label>
                <input 
                  type="password" 
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Email Sender</h4>
              
              <div className="form-group">
                <label>From Email</label>
                <input 
                  type="email" 
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>From Name</label>
                <input 
                  type="text" 
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Test Email</h4>
              <button className="btn-secondary" onClick={handleTestEmail}>
                Send Test Email
              </button>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-tab">
            <h3>Appearance Settings</h3>
            
            <div className="settings-section">
              <h4>Theme</h4>
              
              <div className="theme-selector">
                <div 
                  className={`theme-option ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                >
                  <FaSun /> Light
                </div>
                <div 
                  className={`theme-option ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                >
                  <FaMoon /> Dark
                </div>
                <div 
                  className={`theme-option ${appearanceSettings.theme === 'system' ? 'active' : ''}`}
                  onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'system'})}
                >
                  <FaGlobe /> System
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h4>Colors</h4>
              
              <div className="form-group">
                <label>Primary Color</label>
                <input 
                  type="color" 
                  value={appearanceSettings.primaryColor}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Accent Color</label>
                <input 
                  type="color" 
                  value={appearanceSettings.accentColor}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                />
              </div>
            </div>

            <div className="settings-section">
              <h4>Layout</h4>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={appearanceSettings.sidebarCollapsed}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, sidebarCollapsed: e.target.checked})}
                  />
                  Collapse Sidebar by Default
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={appearanceSettings.animations}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, animations: e.target.checked})}
                  />
                  Enable Animations
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={appearanceSettings.compactMode}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, compactMode: e.target.checked})}
                  />
                  Compact Mode
                </label>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaCog /> System Settings</h2>
            <p>Configure your CyberGuard platform settings</p>
          </div>
          <div className="header-actions">
            {saveSuccess && (
              <div className="success-message">
                <FaCheckCircle /> Settings saved successfully!
              </div>
            )}
            {saveError && (
              <div className="error-message">
                <FaExclamationTriangle /> Error saving settings
              </div>
            )}
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="settings-container">
          <div className="settings-sidebar">
            <button 
              className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaGlobe /> General
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaLock /> Security
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell /> Notifications
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'nist' ? 'active' : ''}`}
              onClick={() => setActiveTab('nist')}
            >
              <FaShieldAlt /> NIST CSF
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
              onClick={() => setActiveTab('database')}
            >
              <FaDatabase /> Database
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              <FaEnvelope /> Email
            </button>
            <button 
              className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <FaPalette /> Appearance
            </button>
          </div>

          <div className="settings-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;