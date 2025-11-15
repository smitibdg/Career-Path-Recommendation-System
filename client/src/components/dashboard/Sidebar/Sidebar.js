import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, user }) => {
  const { logout } = useAuth();

  const handleMyResultsClick = () => {
    const resultsSection = document.getElementById('test-results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to assessments page if results not visible
      setActiveSection('tests'); // This switches to tests section where results will show
    }
  };

  // onClick handler for 'results' item
  const handleItemClick = (itemId) => {
    if (itemId === 'results') {
      handleMyResultsClick();
    } else {
      setActiveSection(itemId);
    }
  };

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
      label: 'User Profile',
      description: 'View & edit profile'
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
            onClick={() => handleItemClick(item.id)} 
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
        <button className="sidebar-action" onClick={logout} title="Logout">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;