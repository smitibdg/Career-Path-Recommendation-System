import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../common/Modal/Modal';
import LoginForm from '../../auth/LoginForm/LoginForm';
import SignupForm from '../../auth/SignupForm/SignupForm';
import './Header.css';

const Header = () => {
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
    setShowSignupModal(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
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
          {/* Logo with Custom Image */}
          <Link to="/" className="logo">
            <img 
              src="/assets/images/logo.png"
              alt="CareerPath Logo"
              className="logo-image"
              onError={(e) => {
                console.log('Logo image failed to load, showing fallback');
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span className="logo-fallback" style={{ display: 'none' }}>🎯</span>
            <span className="logo-text">CareerPath</span>
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
            {/* Login button */}
            <button onClick={openLoginModal} className="btn-outline">
              Login
            </button>

            {/* Emoji Signin Button - No background, just emoji */}
            <button 
              onClick={openSignupModal} 
              className="emoji-signin-btn"
              title="Get Started"
              aria-label="Get Started"
            >
              👤
            </button>
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