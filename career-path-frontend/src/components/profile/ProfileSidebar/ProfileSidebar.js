import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UserContext';
import { useTheme } from '../../../context/ThemeContext';
import ProfileMenu from './ProfileMenu';
import './ProfileSidebar.css';

const ProfileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { userProfile, getCompletionPercentage } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const completionPercentage = getCompletionPercentage();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <div className={`profile-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase() || '👤'}</span>
          </div>
          <div className="user-info">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email}</p>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Profile Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">👤</span>
            <span>Edit Profile</span>
          </Link>

          <div className="nav-divider"></div>

          <button 
            className="nav-item nav-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
            <span className={`nav-arrow ${showMenu ? 'open' : ''}`}>▼</span>
          </button>

          {showMenu && (
            <div className="submenu">
              <button className="submenu-item" onClick={toggleTheme}>
                <span className="nav-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          )}

          <div className="nav-divider"></div>

          <button className="nav-item nav-button logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>CareerPath v1.0</p>
          <p>© 2024 All rights reserved</p>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default ProfileSidebar;