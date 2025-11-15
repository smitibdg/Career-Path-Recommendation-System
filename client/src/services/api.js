// src/services/api.js - Add these endpoints
export const assessmentAPI = {
  // Save assessment results with education level
  saveAssessmentResults: async (userId, testType, results) => {
    return await fetch('/api/assessment/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        testType,
        educationLevel: results.questionLevel,
        responses: results.responses,
        score: results.score,
        timeTaken: results.timeTaken,
        completedAt: results.completionDate
      })
    });
  },

  // Get career recommendations based on assessment + education level
  getCareerRecommendations: async (userId) => {
    return await fetch(`/api/career/recommendations/${userId}`);
  }
};