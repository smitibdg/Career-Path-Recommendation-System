import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import TestCards from '../AssessmentTests/TestCard';
import UserProfile from '../Sidebar/UserProfile/UserProfile';
import CareerMatches from '../AssessmentTests/CareerMatches';
import './MainDashboard.css';

const MainDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('tests');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
        
        if (!userId || !token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Dashboard: User profile loaded:', data);

        if (data.success && data.data) {
          setUserProfile(data.data);
        }
      } catch (error) {
        console.error('Dashboard: Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Listen for career matches navigation
  useEffect(() => {
    const handleNavigateToCareerMatches = () => {
      setActiveSection('career-matches');
    };
    
    window.addEventListener('navigateToCareerMatches', handleNavigateToCareerMatches);
    return () => window.removeEventListener('navigateToCareerMatches', handleNavigateToCareerMatches);
  }, []);

  // Check URL hash on mount
  useEffect(() => {
    if (window.location.hash === '#career-matches') {
      setActiveSection('career-matches');
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'tests':
        return <TestCards />;
      case 'results':
        return <div className="section-content">Results Section - Coming Soon</div>;
      case 'career-matches':
        return <CareerMatches onBack={() => setActiveSection('tests')} />;
      case 'profile':
        return <UserProfile user={userProfile || user} />;
      default:
        return <TestCards />;
    }
  };

  if (loading) {
    return (
      <div className="main-dashboard">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Loading...</h1>
            <p>Please wait while we load your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-dashboard">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={userProfile || user} 
      />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {userProfile?.name || user?.name || 'User'}!</h1>
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