import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProfileForm from './components/profile/ProfileCreation/ProfileForm';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <Router>
              {/* ✅ NO HEADER OR FOOTER HERE */}
              <div className="App">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfileForm />
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
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Router>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;