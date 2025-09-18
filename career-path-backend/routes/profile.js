// UPDATE YOUR EXISTING routes/profile.js
const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
  deleteProfile
} = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');

// All profile routes require authentication
router.use(authenticate);

// Profile routes
router.post('/', createOrUpdateProfile);
router.get('/', getProfile);
router.put('/', createOrUpdateProfile); // Same as POST for create/update
router.delete('/', deleteProfile);

module.exports = router;