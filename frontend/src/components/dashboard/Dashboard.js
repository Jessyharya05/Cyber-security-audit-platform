// src/components/dashboard/Dashboard.js

import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaServer,
  FaBug,
  FaUsers,
  FaChartBar,
  FaPlus,
  FaFileAlt,
  FaRobot,
  FaClipboardCheck,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 156,
    totalVulnerabilities: 43,
    compliantControls: 78,
    totalControls: 120,
    openFindings: 23,
    criticalRisks: 4,
    highRisks: 12,
    mediumRisks: 18,
    lowRisks: 9
  });

  const [nistFunctions, setNistFunctions] = useState([
    { name: 'Identify', compliance: 75, color: '#4299e1', icon: '🔍' },
    { name: 'Protect', compliance: 62, color: '#48bb78', icon: '🛡️' },
    { name: 'Detect', compliance: 48, color: '#ed8936', icon: '👁️' },
    { name: 'Respond', compliance: 83, color: '#9f7aea', icon: '⚡' },
    { name: 'Recover', compliance: 55, color: '#f56565', icon: '🔄' }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'warning',
      icon: <FaExclamationTriangle />,
      title: 'Critical vulnerability detected',
      description: 'SQL Injection found in Customer Portal',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'success',
      icon: <FaCheckCircle />,
      title: 'Audit completed',
      description: 'Network security audit passed',
      time: '2 hours ago'
    },
    {
      id: 3,
      type: 'info',
      icon: <FaClipboardCheck />,
      title: 'New evidence uploaded',
      description: 'Firewall configuration files added',
      time: '3 hours ago'
    },
    {
      id: 4,
      type: 'warning',
      icon: <FaBug />,
      title: 'New vulnerability disclosed',
      description: 'Apache Log4j affected 3 servers',
      time: '1 day ago'
    }
  ]);

  // Chart data untuk compliance trend
  const complianceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Compliance Score',
        data: [65, 68, 72, 75, 78, 82],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart data untuk risk distribution
  const riskDistributionData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [stats.criticalRisks, stats.highRisks, stats.mediumRisks, stats.lowRisks],
        backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#28a745'],
        borderWidth: 0
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Welcome back, Admin! Here's your security status
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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaServer />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAssets}</h3>
            <p>Total Assets</p>
          </div>
          <div className="stat-trend trend-up">
            <FaArrowUp /> +12%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)' }}>
            <FaBug />
          </div>
          <div className="stat-content">
            <h3>{stats.totalVulnerabilities}</h3>
            <p>Vulnerabilities</p>
          </div>
          <div className="stat-trend trend-down">
            <FaArrowDown /> -5%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{Math.round((stats.compliantControls / stats.totalControls) * 100)}%</h3>
            <p>Compliance Rate</p>
          </div>
          <div className="stat-trend trend-up">
            <FaArrowUp /> +8%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #c05621 100%)' }}>
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{stats.openFindings}</h3>
            <p>Open Findings</p>
          </div>
          <div className="stat-trend trend-down">
            <FaArrowDown /> -3
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          {/* NIST CSF Functions */}
          <div className="card" style={{ marginBottom: '25px' }}>
            <div className="card-header">
              <h4>NIST CSF Functions Status</h4>
              <span className="badge bg-primary">v1.1</span>
            </div>
            <div className="nist-functions">
              {nistFunctions.map((func, index) => (
                <div key={index} className="nist-function-item">
                  <div className="function-info">
                    <div className="function-name">
                      <span className="function-dot" style={{ background: func.color }}></span>
                      {func.name}
                    </div>
                    <div className="function-percent">{func.compliance}%</div>
                  </div>
                  <div className="progress-wrapper">
                    <div 
                      className="progress-bar-custom" 
                      style={{ 
                        width: `${func.compliance}%`,
                        background: func.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="card">
            <div className="card-header">
              <h4>Compliance Trend</h4>
              <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="chart-container">
              <Line data={complianceTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Risk Matrix */}
          <div className="card" style={{ marginBottom: '25px' }}>
            <div className="card-header">
              <h4>Risk Matrix</h4>
              <FaChartBar style={{ color: '#667eea' }} />
            </div>
            <div className="risk-matrix">
              <div className="matrix-label">Likelihood \ Impact</div>
              <div className="matrix-label">Low</div>
              <div className="matrix-label">Med</div>
              <div className="matrix-label">High</div>
              <div className="matrix-label">Crit</div>
              
              <div className="matrix-label">High</div>
              <div className="matrix-cell low">2</div>
              <div className="matrix-cell medium">5</div>
              <div className="matrix-cell high">8</div>
              <div className="matrix-cell critical">4</div>
              
              <div className="matrix-label">Med</div>
              <div className="matrix-cell low">6</div>
              <div className="matrix-cell medium">12</div>
              <div className="matrix-cell high">7</div>
              <div className="matrix-cell critical">2</div>
              
              <div className="matrix-label">Low</div>
              <div className="matrix-cell low">15</div>
              <div className="matrix-cell low">10</div>
              <div className="matrix-cell medium">4</div>
              <div className="matrix-cell high">1</div>
            </div>

            <div className="risk-summary">
              <div className="risk-item">
                <span className="risk-label">Overall Risk Score</span>
                <span className="risk-value">64</span>
              </div>
              <div className="risk-item">
                <span className="risk-label">Risk Level</span>
                <span className="risk-badge medium">MEDIUM</span>
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="card">
            <div className="card-header">
              <h4>Risk Distribution</h4>
            </div>
            <div style={{ height: '200px' }}>
              <Doughnut data={riskDistributionData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card" style={{ marginTop: '25px' }}>
        <div className="card-header">
          <h4>Recent Activities</h4>
          <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>View All</a>
        </div>
        <div className="activity-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type}`}>
                {activity.icon}
              </div>
              <div className="activity-content">
                <h6>{activity.title}</h6>
                <p>{activity.description}</p>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn">
          <FaPlus />
          <span>New Audit</span>
        </button>
        <button className="quick-action-btn">
          <FaRobot />
          <span>AI Scan</span>
        </button>
        <button className="quick-action-btn">
          <FaFileAlt />
          <span>Generate Report</span>
        </button>
        <button className="quick-action-btn">
          <FaUsers />
          <span>Team</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;