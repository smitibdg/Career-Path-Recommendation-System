import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import './ProfileHeader.css';

const ProfileHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="profile-header">
      <div className="profile-header-container">
        {/* Logo/Title - Click to go to homepage */}
        <Link to="/" className="profile-logo">
          🎯 <span>CareerPath</span>
        </Link>

        {/* Theme Toggle */}
        <button className="profile-theme-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default ProfileHeader;