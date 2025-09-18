import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../Modal/Modal';
import LoginForm from '../../auth/LoginForm/LoginForm';
import SignupForm from '../../auth/SignupForm/SignupForm';
import './Header.css';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/login' || currentPath === '/signup') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  // Modal handlers
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false); // Close signup if open
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false); // Close login if open
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  // Switch between modals
  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo">
            🎯 <span>CareerPath</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <button onClick={() => handleNavClick('home')} className="nav-btn">
              Home
            </button>
            <button onClick={() => handleNavClick('features')} className="nav-btn">
              Features
            </button>
            <button onClick={() => handleNavClick('how-it-works')} className="nav-btn">
              How It Works
            </button>
            <button onClick={() => handleNavClick('testimonials')} className="nav-btn">
              Testimonials
            </button>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Theme button - Non-functional during Phase 2 */}
            <button className="theme-btn" disabled title="Theme switching coming soon">
              🌙
            </button>
            
              <>
                <button onClick={openLoginModal} className="btn-outline">
                  Login
                </button>
                <button onClick={openSignupModal} className="btn-primary">
                  Get Started
                </button>
              </>
            
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={closeLoginModal}>
        <div className="modal-form-container">
          <div className="modal-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your career discovery journey</p>
          </div>
          <LoginForm 
            onSuccess={closeLoginModal}
            onSwitchToSignup={switchToSignup}
          />
        </div>
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={showSignupModal} onClose={closeSignupModal}>
        <div className="modal-form-container">
          <div className="modal-header">
            <h2>Get Started</h2>
            <p>Create your account to begin your career journey</p>
          </div>
          <SignupForm 
            onSuccess={closeSignupModal}
            onSwitchToLogin={switchToLogin}
          />
        </div>
      </Modal>
    </>
  );
};

export default Header;