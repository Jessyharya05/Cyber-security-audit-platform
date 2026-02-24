// src/components/admin/AdminAuditors.js
// INI YANG MUNCUL DI GAMBAR - DAFTAR AUDITOR

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { 
  FaUserTie, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaEnvelope,
  FaPhone,
  FaCertificate,
  FaFilter
} from 'react-icons/fa';
import './Admin.css';

const AdminAuditors = () => {
  const [auditors, setAuditors] = useState([
    { 
      id: 1, 
      name: 'Dr. Robert Wilson', 
      specialization: 'Network Security',
      email: 'robert.wilson@cyber.com',
      phone: '+62 812-3456-7890',
      certifications: ['CISSP', 'CEH', 'CISA'],
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Lisa Anderson', 
      specialization: 'Web Security',
      email: 'lisa.anderson@cyber.com',
      phone: '+62 813-9876-5432',
      certifications: ['OSCP', 'CEH', 'CISSP'],
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      specialization: 'Cloud Security',
      email: 'michael.chen@cyber.com',
      phone: '+62 814-5678-1234',
      certifications: ['CCSP', 'AWS Security', 'CISSP'],
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2><FaUserTie /> Auditors Management</h2>
            <p>Manage security auditors and their assignments</p>
          </div>
          <button className="btn-primary"><FaPlus /> Add Auditor</button>
        </div>

        {/* Search Bar - Sesuai gambar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search auditors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Headers - Sesuai gambar: D, L, M */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>D</th>
                <th>L</th>
                <th>M</th>
              </tr>
            </thead>
            <tbody>
              {auditors.map(auditor => (
                <tr key={auditor.id}>
                  <td>
                    <strong>{auditor.name}</strong>
                    <div>{auditor.specialization}</div>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                  <td>
                    <div>{auditor.email}</div>
                    <div>{auditor.phone}</div>
                    <div className="cert-badges">
                      {auditor.certifications.map((cert, idx) => (
                        <span key={idx} className="cert-badge">{cert}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditors;