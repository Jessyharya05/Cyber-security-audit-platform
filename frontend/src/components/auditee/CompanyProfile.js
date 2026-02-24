// src/components/auditee/CompanyProfile.js

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaBuilding, 
  FaEdit, 
  FaSave,
  FaUsers,
  FaGlobe,
  FaShieldAlt,
  FaInfoCircle,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import './Auditee.css';

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    companyName: 'Tech Solutions Inc',
    email: 'contact@techsolutions.com',
    phone: '+62 21 1234 5678',
    sector: 'Technology',
    employees: 150,
    systemType: 'Web Application & Cloud Services',
    address: 'Jl. Sudirman No. 123, Jakarta',
    registrationDate: '2024-01-15',
    lastAudit: '2024-02-01',
    exposureLevel: 'Medium'
  });

  const [editedProfile, setEditedProfile] = useState({...profile});

  // Calculate exposure level based on inputs
  const calculateExposure = (sector, employees, systemType) => {
    let score = 0;
    
    // Sector risk
    const highRiskSectors = ['Finance', 'Healthcare', 'Government'];
    if (highRiskSectors.includes(sector)) score += 3;
    else if (sector === 'Technology') score += 2;
    else score += 1;
    
    // Employee count
    if (employees > 1000) score += 3;
    else if (employees > 100) score += 2;
    else score += 1;
    
    // System type
    if (systemType.toLowerCase().includes('cloud')) score += 3;
    else if (systemType.toLowerCase().includes('web')) score += 2;
    else score += 1;
    
    if (score >= 8) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate exposure when relevant fields change
      if (name === 'sector' || name === 'employees' || name === 'systemType') {
        updated.exposureLevel = calculateExposure(
          updated.sector,
          parseInt(updated.employees) || 0,
          updated.systemType
        );
      }
      return updated;
    });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="auditee">
      <div className="auditee-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaBuilding /> Company Profile</h2>
            <p>Manage your organization information</p>
          </div>
          {!isEditing ? (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="header-actions">
              <button className="btn-primary" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="profile-container">
          <div className="profile-header-card">
            <div className="profile-avatar">
              <FaBuilding />
            </div>
            <div className="profile-title">
              <h1>{profile.companyName}</h1>
              <p>Sector: {profile.sector} · {profile.employees} employees</p>
            </div>
            <div className={`exposure-badge ${profile.exposureLevel.toLowerCase()}`}>
              Exposure: {profile.exposureLevel}
            </div>
          </div>

          <div className="profile-grid">
            {/* Basic Information */}
            <div className="profile-card">
              <h3><FaInfoCircle /> Basic Information</h3>
              <div className="profile-fields">
                <div className="field">
                  <label>Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="companyName"
                      value={editedProfile.companyName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.companyName}</p>
                  )}
                </div>

                <div className="field">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <p><FaEnvelope /> {profile.email}</p>
                  )}
                </div>

                <div className="field">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <p><FaPhone /> {profile.phone}</p>
                  )}
                </div>

                <div className="field">
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editedProfile.address}
                      onChange={handleChange}
                      rows="2"
                    />
                  ) : (
                    <p>{profile.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="profile-card">
              <h3><FaBuilding /> Business Information</h3>
              <div className="profile-fields">
                <div className="field">
                  <label>Sector</label>
                  {isEditing ? (
                    <select
                      name="sector"
                      value={editedProfile.sector}
                      onChange={handleChange}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  ) : (
                    <p>{profile.sector}</p>
                  )}
                </div>

                <div className="field">
                  <label>Number of Employees</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="employees"
                      value={editedProfile.employees}
                      onChange={handleChange}
                    />
                  ) : (
                    <p><FaUsers /> {profile.employees} employees</p>
                  )}
                </div>

                <div className="field">
                  <label>System Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="systemType"
                      value={editedProfile.systemType}
                      onChange={handleChange}
                      placeholder="e.g., Web, Cloud, Mobile"
                    />
                  ) : (
                    <p><FaGlobe /> {profile.systemType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="profile-card">
              <h3><FaShieldAlt /> Security Information</h3>
              <div className="profile-fields">
                <div className="field">
                  <label>Exposure Level</label>
                  <p className={`exposure-text ${profile.exposureLevel.toLowerCase()}`}>
                    {profile.exposureLevel}
                  </p>
                  {isEditing && (
                    <small>Auto-calculated based on sector, size, and system type</small>
                  )}
                </div>

                <div className="field">
                  <label>Registration Date</label>
                  <p><FaCalendarAlt /> {profile.registrationDate}</p>
                </div>

                <div className="field">
                  <label>Last Audit</label>
                  <p><FaCalendarAlt /> {profile.lastAudit}</p>
                </div>
              </div>
            </div>

            {/* Exposure Calculation Info */}
            <div className="profile-card">
              <h3>📊 Exposure Level Calculation</h3>
              <div className="exposure-calculation">
                <div className="calc-item">
                  <span>Sector (Finance/Healthcare/Government):</span>
                  <span className={profile.sector === 'Finance' || profile.sector === 'Healthcare' ? 'high' : 'normal'}>
                    +{profile.sector === 'Finance' || profile.sector === 'Healthcare' ? 3 : 2}
                  </span>
                </div>
                <div className="calc-item">
                  <span>Employees ({profile.employees}):</span>
                  <span className={profile.employees > 1000 ? 'high' : profile.employees > 100 ? 'medium' : 'low'}>
                    +{profile.employees > 1000 ? 3 : profile.employees > 100 ? 2 : 1}
                  </span>
                </div>
                <div className="calc-item">
                  <span>System Type ({profile.systemType}):</span>
                  <span className={profile.systemType.toLowerCase().includes('cloud') ? 'high' : 'medium'}>
                    +{profile.systemType.toLowerCase().includes('cloud') ? 3 : 2}
                  </span>
                </div>
                <div className="calc-total">
                  <span>Total Score:</span>
                  <span className={`exposure-${profile.exposureLevel.toLowerCase()}`}>
                    {profile.exposureLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;