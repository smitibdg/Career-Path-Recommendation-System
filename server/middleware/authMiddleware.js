const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Authorization header does not start with Bearer');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      console.log('No token found after Bearer');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    console.log('Verifying token with secret...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'career-path-jwt-secret-2025');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found in database for userId:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }


    // Add user to request
    req.user = { 
      userId: user._id,
      email: user.email,
      name: user.name 
    };
    
    console.log('Auth middleware completed successfully');
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('JWT Error: Invalid token');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('JWT Error: Token expired');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }

    if (error.name === 'NotBeforeError') {
      console.log('JWT Error: Token not active');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token not active.'
      });
    }

    console.log('Unknown auth error');
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

// Alternative middleware with different approach (if above doesn't work)
exports.authenticateAlt = async (req, res, next) => {
  try {
    console.log('🔐 Alternative auth middleware called');
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token in alternative middleware');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('Alt middleware token preview:', token.substring(0, 15) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'career-path-jwt-secret-2025');
    console.log('Alt middleware decoded:', decoded);

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('Alt middleware user found:', user.email);
    req.user = { userId: user._id };
    next();
    
  } catch (error) {
    console.error('Alt middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};