import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './LoginForm.css';

const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        setEmail('');
        setPassword('');
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
    <div className="login-form-container">

      {error && <div className="error-message">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <div className="input-wrapper">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="form-options">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            Remember me
          </label>
          <button type="button" className="forgot-password-link">
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="switch-form-link"
              onClick={onSwitchToSignup}
              disabled={isSubmitting}
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
