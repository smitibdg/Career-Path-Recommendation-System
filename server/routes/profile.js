const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  completeAssessment,
  getAssessmentProgress
} = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');

// All profile routes require authentication
router.use(authenticate);

// Profile routes
router.post('/', createOrUpdateProfile);           // Create profile
router.get('/', getProfile);                      // Get profile
router.put('/', updateProfile);                   // Update profile  
router.delete('/', deleteProfile);                // Delete profile

// Assessment routes
router.post('/assessment/complete', completeAssessment);     // Complete assessment
router.get('/assessment/progress', getAssessmentProgress);   // Get assessment progress

module.exports = router;