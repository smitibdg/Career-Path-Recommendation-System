// CAREER PATH RECOMMENDATION SYSTEM - MAIN APP COMPONENT
// Purpose: Main application component with routing and authentication
// Features: Route management, Authentication protection, Layout management

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

// Page Components
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProfileCreation from './components/auth/ProfileCreationForm/ProfileCreationForm';
import ProfileSettings from './components/dashboard/ProfileSettings/ProfileSettings';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';

// Global Styles
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <UserProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/profile-creation" 
                element={
                  <ProtectedRoute>
                    <ProfileCreation />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/profile-settings" 
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route for 404 errors */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;