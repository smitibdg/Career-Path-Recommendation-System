const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');

console.log(' PROFILE ROUTES FILE LOADED!');

// All profile routes require authentication
router.use(authenticate);

// Profile routes
router.post('/', profileController.createOrUpdateProfile);           // Create profile
router.get('/', profileController.getProfile);                      // Get profile
router.put('/', profileController.updateProfile);                   // Update profile  
router.delete('/', profileController.deleteProfile);                // Delete profile

// Assessment routes
router.post('/assessment/complete', profileController.completeAssessment);     // Complete assessment
router.get('/assessment/progress', profileController.getAssessmentProgress);   // Get assessment progress

// MODEL 2 ROUTES - Using consistent profileController. syntax:
router.post('/predict-career', profileController.predictCareerCluster);        // Model 2 prediction
router.get('/batch-test-model2', profileController.batchTestModel2);          // Batch test
router.get('/career-prediction/:userId', profileController.getCareerPrediction); // Get prediction

// DEBUG: Test route (ADD THIS LINE AFTER LINE 24)
router.get('/test-working', (req, res) => {
  res.json({ success: true, message: 'Routes are working!', timestamp: new Date() });
});

// Mark test as completed (real tracking)
router.post('/mark-test-completed', profileController.markTestCompleted);

module.exports = router;