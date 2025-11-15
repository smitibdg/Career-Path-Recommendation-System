import React from 'react';
import { useAuth } from '../../context/AuthContext';
import MainDashboard from '../../components/dashboard/MainDashboard/MainDashboard';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <MainDashboard user={user} />
    </div>
  );
};

export default DashboardPage;