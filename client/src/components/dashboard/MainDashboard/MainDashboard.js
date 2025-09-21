import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TestCards from '../AssessmentTests/TestCard';
import UserProfile from '../Sidebar/UserProfile/UserProfile';
import './MainDashboard.css';

const MainDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('tests');

  const renderContent = () => {
    switch (activeSection) {
      case 'tests':
        return <TestCards />;
      case 'results':
        return <div className="section-content">Results Section - Coming Soon</div>;
      case 'career-matches':
        return <div className="section-content">Career Matches - Coming Soon</div>;
      case 'profile':
        return <UserProfile user={user} />;
      default:
        return <TestCards />;
    }
  };

  return (
    <div className="main-dashboard">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Continue your career discovery journey</p>
        </div>
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;