import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ Context Providers (Global State Management)
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
// ❌ REMOVED: import { ThemeProvider } from './context/ThemeContext';

// ✅ Common Components
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop'; // ✅ NEW: Added ScrollToTop

// ✅ Authentication Components
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';

// ✅ Page Components (Updated paths if needed)
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// ✅ Profile Component (Check if path matches your actual folder name)
import ProfileForm from './components/profile/ProfileCreationForm/ProfileCreationForm';
// Alternative if you renamed it: import ProfileCreationForm from './components/profile/ProfileCreationForm/ProfileCreationForm';

// ✅ Global Styles
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      {/* ❌ REMOVED: <ThemeProvider> - Theme functionality temporarily disabled */}
      <AuthProvider>
        <UserProvider>
          <Router>
            {/* ✅ NEW: ScrollToTop ensures all page navigation starts at top */}
            <ScrollToTop />
            
            {/* ✅ NO HEADER OR FOOTER HERE - Only on Landing Page */}
            <div className="App">
              <Routes>
                {/* 🏠 Landing Page - Public route with header/footer */}
                <Route path="/" element={<LandingPage />} />
                
                {/* 👤 Profile Creation - Protected route after signup */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfileForm />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 📊 Main Dashboard - Protected route with sidebar */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 🚫 404 Not Found - Catch all unmatched routes */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </UserProvider>
      </AuthProvider>
      {/* ❌ REMOVED: </ThemeProvider> */}
    </ErrorBoundary>
  );
}

export default App;