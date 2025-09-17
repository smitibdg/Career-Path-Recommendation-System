import React, { useState } from 'react';
import Header from '../../components/common/Header/Header'; // ✅ ADD HEADER
import Footer from '../../components/common/Footer/Footer'; // ✅ ADD FOOTER
import HeroSection from '../../components/landing/HeroSection/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection/FeaturesSection';
import HowItWorks from '../../components/landing/HowItWorksSection/HowItWorks';
import Testimonials from '../../components/landing/TestimonialsSection/Testimonials';
import Modal from '../../components/common/Modal/Modal';
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
      {/* ✅ HEADER ONLY ON LANDING PAGE */}
      <Header />
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
            <HowItWorks 
              onLoginClick={openLoginModal}
              onSignupClick={openSignupModal}
            />
          </section>
          <section id="testimonials">
            <Testimonials />
          </section>
        </div>
      </div>

      {/* ✅ FOOTER ONLY ON LANDING PAGE */}
      <Footer />

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

export default LandingPage;