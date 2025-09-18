import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './SignupForm.css';

const SignupForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      onSuccess(); // Close modal
      navigate('/profile');
    } else {
      setError(result.message || 'Signup failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="signup-form">
      {error && (
        <div className="error-alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your Name"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your Email"
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter a new Password"
            minLength="6"
          />
        </div>
        
        {/* ✅ NEW: Confirm Password Field */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Confirm your Password"
            className={
              formData.confirmPassword && 
              formData.password !== formData.confirmPassword 
                ? 'password-mismatch' 
                : ''
            }
          />
          {/* Show mismatch indicator */}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <small className="password-hint error">
              Passwords do not match
            </small>
          )}
          {/* Show match indicator */}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <small className="password-hint success">
              Passwords match ✓
            </small>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || (formData.password !== formData.confirmPassword)}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="switch-link"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;