// src/components/dashboard/UserDashboard.js

import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaUser,
  FaClock,
  FaTasks,
  FaFlag,
  FaArrowRight,
  FaBell,
  FaFileAlt,
  FaClipboardList
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [myTasks] = useState([
    { id: 1, task: 'Review security policies', due: '2024-03-01', priority: 'high', status: 'pending' },
    { id: 2, task: 'Complete security training', due: '2024-02-28', priority: 'medium', status: 'in-progress' },
    { id: 3, task: 'Update password', due: '2024-02-25', priority: 'high', status: 'completed' },
    { id: 4, task: 'Submit access request', due: '2024-03-05', priority: 'low', status: 'pending' }
  ]);

  const [notifications] = useState([
    { id: 1, message: 'New security policy updated', time: '1 hour ago', type: 'info' },
    { id: 2, message: 'Your access request approved', time: '3 hours ago', type: 'success' },
    { id: 3, message: 'Security training due tomorrow', time: '5 hours ago', type: 'warning' }
  ]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { text: 'Completed', color: '#28a745', bg: '#e6f7e6' };
      case 'in-progress':
        return { text: 'In Progress', color: '#fd7e14', bg: '#fff3e6' };
      case 'pending':
        return { text: 'Pending', color: '#6c757d', bg: '#f8f9fa' };
      default:
        return { text: status, color: '#6c757d', bg: '#f8f9fa' };
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>My Dashboard</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Welcome back, <strong>{user?.name}</strong>! Here's your personal overview
          </p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards - User Version */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)' }}>
            <FaTasks />
          </div>
          <div className="stat-content">
            <h3>{myTasks.filter(t => t.status === 'pending').length}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{myTasks.filter(t => t.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #c05621 100%)' }}>
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{myTasks.filter(t => new Date(t.due) < new Date() && t.status !== 'completed').length}</h3>
            <p>Overdue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' }}>
            <FaBell />
          </div>
          <div className="stat-content">
            <h3>{notifications.length}</h3>
            <p>Notifications</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column - My Tasks */}
        <div className="card">
          <div className="card-header">
            <h4>My Tasks</h4>
            <span className="badge">Due This Week</span>
          </div>
          <div className="activity-list">
            {myTasks.map(task => {
              const status = getStatusBadge(task.status);
              return (
                <div key={task.id} className="activity-item">
                  <div className="activity-icon" style={{ background: getPriorityColor(task.priority) }}>
                    <FaFlag />
                  </div>
                  <div className="activity-content">
                    <h6>{task.task}</h6>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#666' }}>
                      <span>Due: {task.due}</span>
                      <span style={{ 
                        padding: '2px 8px', 
                        background: status.bg,
                        color: status.color,
                        borderRadius: '12px'
                      }}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  <FaArrowRight style={{ color: '#667eea', cursor: 'pointer' }} />
                </div>
              );
            })}
          </div>
          <button style={{
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            background: 'none',
            border: '2px dashed #667eea',
            borderRadius: '10px',
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            View All Tasks
          </button>
        </div>

        {/* Right Column - Notifications */}
        <div className="card">
          <div className="card-header">
            <h4>Notifications</h4>
            <FaBell style={{ color: '#667eea' }} />
          </div>
          <div className="activity-list">
            {notifications.map(notif => (
              <div key={notif.id} className="activity-item">
                <div className={`activity-icon ${notif.type}`}>
                  {notif.type === 'warning' && <FaExclamationTriangle />}
                  {notif.type === 'success' && <FaCheckCircle />}
                  {notif.type === 'info' && <FaShieldAlt />}
                </div>
                <div className="activity-content">
                  <p style={{ margin: '0 0 5px 0' }}>{notif.message}</p>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card" style={{ marginTop: '25px' }}>
        <div className="card-header">
          <h4>Quick Access</h4>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <FaFileAlt size={30} style={{ color: '#667eea', marginBottom: '10px' }} />
            <h6>My Reports</h6>
          </div>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <FaClipboardList size={30} style={{ color: '#667eea', marginBottom: '10px' }} />
            <h6>Training</h6>
          </div>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <FaShieldAlt size={30} style={{ color: '#667eea', marginBottom: '10px' }} />
            <h6>Security Tips</h6>
          </div>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <FaUser size={30} style={{ color: '#667eea', marginBottom: '10px' }} />
            <h6>My Profile</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;