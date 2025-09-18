// UPDATE YOUR EXISTING routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

module.exports = router;