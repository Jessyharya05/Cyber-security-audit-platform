// src/App.js (tambahkan route untuk auditee)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCompanies from './components/admin/AdminCompanies';
import AdminUsers from './components/admin/AdminUsers';
import AdminAuditors from './components/admin/AdminAuditors';
import AdminAudits from './components/admin/AdminAudits';
import AdminReports from './components/admin/AdminReports';
import AdminSettings from './components/admin/AdminSettings';

// Auditor Pages
import AuditorDashboard from './components/auditor/AuditorDashboard';
import AuditorRiskAssessment from './components/auditor/AuditorRiskAssessment';
import AuditorChecklist from './components/auditor/AuditorChecklist';
import AuditorAIAssistant from './components/auditor/AuditorAIAssistant';
import AuditorReports from './components/auditor/AuditorReports';

// Auditee Pages
import AuditeeDashboard from './components/auditee/AuditeeDashboard';
import CompanyProfile from './components/auditee/CompanyProfile';
import CompanyAssets from './components/auditee/CompanyAssets';
import CompanyEvidence from './components/auditee/CompanyEvidence';
import CompanyFindings from './components/auditee/CompanyFindings';
import CompanyReports from './components/auditee/CompanyReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/auditors" element={<AdminAuditors />} />
            <Route path="/admin/audits" element={<AdminAudits />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Auditor Routes */}
            <Route path="/auditor/dashboard" element={<AuditorDashboard />} />
            <Route path="/auditor/risk-assessment" element={<AuditorRiskAssessment />} />
            <Route path="/auditor/checklist" element={<AuditorChecklist />} />
            <Route path="/auditor/ai-assistant" element={<AuditorAIAssistant />} />
            <Route path="/auditor/reports" element={<AuditorReports />} />
            
            {/* Auditee Routes */}
            <Route path="/auditee/dashboard" element={<AuditeeDashboard />} />
            <Route path="/auditee/profile" element={<CompanyProfile />} />
            <Route path="/auditee/assets" element={<CompanyAssets />} />
            <Route path="/auditee/evidence" element={<CompanyEvidence />} />
            <Route path="/auditee/findings" element={<CompanyFindings />} />
            <Route path="/auditee/reports" element={<CompanyReports />} />
            
            {/* Default */}
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;