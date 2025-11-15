import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './SignupForm.css';

const SignupForm = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();

  // ✅ ADD NAME VALIDATION FUNCTION
  const validateName = (name) => {
    const nameStr = name.trim();
    
    // Check minimum length
    if (nameStr.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    // Check maximum length
    if (nameStr.length > 50) {
      return 'Name must be less than 50 characters';
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(nameStr)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Check for at least one letter
    const hasLetter = /[a-zA-Z]/.test(nameStr);
    if (!hasLetter) {
      return 'Name must contain at least one letter';
    }
    
    // Check for excessive spaces
    if (/\s{2,}/.test(nameStr)) {
      return 'Name cannot have multiple consecutive spaces';
    }
    
    // Check if starts/ends with space
    if (nameStr !== nameStr.trim()) {
      return 'Name cannot start or end with spaces';
    }
    
    return null; // Valid
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Name Validation Check
    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup(name.trim(), email, password);
      if (result.success) {
        onClose();
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Network error. Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-form-container">
      {error && <div className="error-message">{error}</div>}

      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <div className="input-wrapper">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <span className="input-icon">👤</span>
        </div>

        <label htmlFor="email">Email Address</label>
        <div className="input-wrapper">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <span className="input-icon">📧</span>
        </div>

        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a new Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={toggleShowPassword}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-wrapper">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={toggleShowConfirmPassword}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit" className="create-account-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="footer-text">
          <span>Already have an account? </span>
            <button 
              type="button" 
              className="signin-btn" 
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
            >
              Sign In
            </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;