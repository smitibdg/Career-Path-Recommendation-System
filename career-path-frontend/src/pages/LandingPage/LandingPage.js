import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import HeroSection from '../../components/landing/HeroSection/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection/FeaturesSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection/HowItWorks';
import TestimonialsSection from '../../components/landing/TestimonialsSection/Testimonials';
// ✅ REMOVED: import Modal from '../../components/common/Modal/Modal';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import SignupForm from '../../components/auth/SignupForm/SignupForm';
import './LandingPage.css';

const LandingPage = () => {
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

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
      <Header 
        onLoginClick={openLoginModal}
        onSignupClick={openSignupModal}
      />
      
      <div className="landing-page-wrapper">
        <div className="landing-page">
          <section id="home">
            <HeroSection 
              onLoginClick={openLoginModal}
              onSignupClick={openSignupModal}
            />
          </section>
          
          <section id="features">
            <FeaturesSection 
              onLoginClick={openLoginModal}
              onSignupClick={openSignupModal}
            />
          </section>
          
          <section id="how-it-works">
            <HowItWorksSection 
              onLoginClick={openLoginModal}
              onSignupClick={openSignupModal}
            />
          </section>
          
          <section id="testimonials">
            <TestimonialsSection />
          </section>
        </div>
      </div>
      
      <Footer />

      {/* ✅ FIXED: Direct form rendering without Modal wrapper */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <LoginForm 
              onClose={closeLoginModal}
              onSwitchToSignup={switchToSignup}
            />
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal-overlay" onClick={closeSignupModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SignupForm 
              onClose={closeSignupModal}
              onSwitchToLogin={switchToLogin}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;