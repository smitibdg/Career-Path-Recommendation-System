import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, user }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const sidebarItems = [
    {
      id: 'tests',
      icon: '📝',
      label: 'Assessment Tests',
      description: 'Take career assessments'
    },
    {
      id: 'results',
      icon: '📊',
      label: 'My Results',
      description: 'View test results'
    },
    {
      id: 'career-matches',
      icon: '🎯',
      label: 'Career Matches',
      description: 'Recommended careers'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile Settings',
      description: 'Edit profile info'
    }
  ];

  return (
    <div className="sidebar-container">
      {/* User Avatar */}
      <div className="sidebar-user">
        <div className="user-avatar-small">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="user-details-expand">
          <span className="user-name">{user?.name}</span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <div className="sidebar-text">
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-description">{item.description}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        <button className="sidebar-action" onClick={toggleTheme} title="Toggle Theme">
          <span className="sidebar-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          <span className="sidebar-label">Theme</span>
        </button>
        <button className="sidebar-action" onClick={logout} title="Logout">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;