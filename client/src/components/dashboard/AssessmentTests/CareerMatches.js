import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './CareerMatches.css';

const CareerMatches = ({ onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCareerRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId) {
          setError('Please log in to view career recommendations');
          setLoading(false);
          return;
        }

        // API CALL:
        // PROFILE ROUTE
        const response = await fetch(`/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success && data.data) {
          const userData = data.data;
          setUserProfile(userData);

          if (userData.assessmentResults?.model3Results?.predictedCareerRoles && 
              userData.assessmentResults.model3Results.predictedCareerRoles.length > 0) {
            
            const realRecommendations = userData.assessmentResults.model3Results.predictedCareerRoles
              .slice(0, 4)
              .map((rec, index) => ({
                rank: index + 1,
                role: rec.role,
                cluster: rec.cluster,
                confidence: rec.confidence,
                requiredSkills: Array.isArray(rec.requiredSkills) ? rec.requiredSkills : (rec.requiredSkills?.split(',') || ['Programming', 'Problem Solving']),
                educationRequired: rec.educationRequired || userData.educationLevel || 'Bachelors',
                averageSalary: rec.averageSalary || { min: 600000, max: 1500000, currency: 'INR' },
                jobOutlook: rec.jobOutlook || 'Excellent',
                growthPath: Array.isArray(rec.growthPath) ? rec.growthPath : (rec.growthPath?.split(',') || [`Junior ${rec.role}`, `Senior ${rec.role}`, `Lead ${rec.role}`, 'Manager']),
                learningResources: rec.learningResources || [{ title: 'Professional Development', url: 'https://coursera.org', type: 'Course', free: true }],
                entranceExams: Array.isArray(rec.entranceExams) ? rec.entranceExams : (rec.entranceExams?.split(',') || ['Competitive Exams']),
                recommendedFields: Array.isArray(rec.recommendedFields) ? rec.recommendedFields : (rec.recommendedFields?.split(',') || [rec.cluster + ' Studies'])
              }));
            
            setCareerRecommendations(realRecommendations);
            
          } else if (userData.careerRole) {
            const fallbackRecommendations = [
              {
                rank: 1,
                role: userData.careerRole,
                cluster: userData.careerCluster || 'Technology',
                confidence: userData.roleConfidence || 0.85,
                requiredSkills: ['Programming', 'Problem Solving', 'Communication', 'Analytical Thinking'],
                educationRequired: userData.educationLevel || 'Bachelors',
                averageSalary: { min: 600000, max: 1500000, currency: 'INR' },
                jobOutlook: 'Excellent',
                growthPath: [`Junior ${userData.careerRole}`, `Senior ${userData.careerRole}`, `Lead ${userData.careerRole}`, 'Manager'],
                learningResources: [{ title: 'Professional Development', url: 'https://coursera.org', type: 'Course', free: true }],
                entranceExams: ['Competitive Exams', 'Industry Certifications'],
                recommendedFields: [userData.careerCluster + ' Studies']
              },
              {
                rank: 2,
                role: `Senior ${userData.careerRole}`,
                cluster: userData.careerCluster || 'Technology',
                confidence: userData.roleConfidence * 0.9 || 0.75,
                requiredSkills: ['Advanced Skills', 'Leadership', 'Project Management'],
                educationRequired: userData.educationLevel || 'Bachelors',
                averageSalary: { min: 800000, max: 2000000, currency: 'INR' },
                jobOutlook: 'Very Good',
                growthPath: [`Senior ${userData.careerRole}`, `Lead ${userData.careerRole}`, 'Manager', 'Director'],
                learningResources: [{ title: 'Leadership Training', url: 'https://coursera.org', type: 'Course', free: true }],
                entranceExams: ['Professional Certifications', 'Management Programs'],
                recommendedFields: ['Management Studies', userData.careerCluster + ' Leadership']
              },
              {
                rank: 3,
                role: `${userData.careerCluster} Specialist`,
                cluster: userData.careerCluster || 'Technology',
                confidence: userData.roleConfidence * 0.8 || 0.68,
                requiredSkills: ['Domain Expertise', 'Research', 'Innovation'],
                educationRequired: 'Masters or Higher',
                averageSalary: { min: 700000, max: 1800000, currency: 'INR' },
                jobOutlook: 'Good',
                growthPath: ['Specialist', 'Senior Specialist', 'Principal Specialist', 'Expert'],
                learningResources: [{ title: 'Specialized Training', url: 'https://coursera.org', type: 'Course', free: true }],
                entranceExams: ['Specialization Exams', 'Research Programs'],
                recommendedFields: [`${userData.careerCluster} Research`, 'Advanced Studies']
              }
            ];
            
            setCareerRecommendations(fallbackRecommendations);
            
          } else {
            console.log('No career predictions found, triggering Model 3...');
            await triggerModel3Prediction(userId, token);
          }
          
        } else {
          setError(data.message || 'Failed to load career data');
        }
        
      } catch (error) {
        console.error('Error fetching career data:', error);
        setError('Failed to load career recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareerRecommendations();
  }, [user]);

  const triggerModel3Prediction = async (userId, token) => {
    try {
      console.log('🔄 Triggering Model 3 prediction...');
      
      const response = await fetch(`/api/ml/predict-model3`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      
      if (result.success && result.data?.recommendations) {
        const newRecommendations = result.data.recommendations
          .slice(0, 4)
          .map((rec, index) => ({
            rank: index + 1,
            role: rec.careerrole || rec.role,
            cluster: rec.careercluster || rec.cluster,
            confidence: rec.confidencescore || rec.confidence,
            requiredSkills: (rec.requiredskills || 'Programming, Problem Solving').split(','),
            educationRequired: rec.educationlevelrequired || 'Bachelors',
            averageSalary: {
              min: 600000,
              max: 1500000,
              currency: 'INR'
            },
            jobOutlook: rec.joboutlook || 'Excellent',
            growthPath: (rec.growthpath || `Junior ${rec.role},Senior ${rec.role}`).split(','),
            learningResources: [{ title: 'Professional Development', url: 'https://coursera.org', type: 'Course', free: true }],
            entranceExams: (rec.entranceexams || 'Competitive Exams').split(','),
            recommendedFields: (rec.fieldforadmission || rec.cluster + ' Studies').split(',')
          }));
        
        setCareerRecommendations(newRecommendations);
      } else {
        setError('Unable to generate career predictions. Please retake assessments.');
      }
    } catch (error) {
      console.error('Model 3 prediction failed:', error);
      setError('Failed to generate career predictions. Please retake assessments.');
    }
  };

  const handleCardClick = (role) => {
    setSelectedRole(role);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRole(null);
  };

  if (loading) {
    return (
      <div className="cm-loading">
        <div className="loading-spinner"></div>
        <p>Loading your career matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cm-error">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button onClick={onBack} className="cm-btn back-btn">
          Back to Tests
        </button>
      </div>
    );
  }

  if (careerRecommendations.length === 0) {
    return (
      <div className="cm-error">
        <div className="error-icon">📋</div>
        <h3>No career recommendations available</h3>
        <p>Please complete all assessments to get personalized career recommendations.</p>
        <button onClick={onBack} className="cm-btn back-btn">
          Back to Tests
        </button>
      </div>
    );
  }

  return (
    <div className="career-matches-container">
      <div className="cm-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>Your AI-Powered Career Matches</h2>
        <p>Based on your latest assessment results</p>
      </div>

      <div className="cm-small-cards-grid">
        {careerRecommendations.map((rec, index) => (
          <div 
            className="cm-small-card" 
            key={index}
          >
            <div className="cm-rank-badge">#{rec.rank}</div>
            <h3 className="cm-card-title">{rec.role}</h3>
            <p className="cm-card-cluster">{rec.cluster}</p>
            <div className="cm-confidence-bar">
              <div 
                className="cm-confidence-fill" 
                style={{ width: `${Math.round(rec.confidence * 100)}%` }}
              ></div>
              <span className="cm-confidence-text">
                {Math.round(rec.confidence * 100)}% Match
              </span>
            </div>
            <button className="cm-view-details-btn" onClick={() => handleCardClick(rec)}> View Details </button>
          </div>
        ))}
      </div>

      {showPopup && selectedRole && (
        <div className="cm-popup-overlay" onClick={closePopup}>
          <div className="cm-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="cm-popup-close" onClick={closePopup}>×</button>
            
            <h2>{selectedRole.role}</h2>
            <p className="popup-cluster">{selectedRole.cluster}</p>
            
            <div className="popup-confidence">
              <div 
                className="confidence-bar-popup"
                style={{ width: `${Math.round(selectedRole.confidence * 100)}%` }}
              ></div>
              <span>{Math.round(selectedRole.confidence * 100)}% Match</span>
            </div>

            <div className="popup-section">
              <h4>Required Skills</h4>
              <div className="popup-skills">
                {selectedRole.requiredSkills.slice(0, 6).map((skill, idx) => (
                  <span className="popup-skill-tag" key={idx}>{skill.trim()}</span>
                ))}
              </div>
            </div>

            <div className="popup-section">
              <h4>Career Growth Path</h4>
              <div className="popup-growth-path">
                {selectedRole.growthPath.slice(0, 4).map((stage, idx) => (
                  <div className="popup-growth-stage" key={idx}>
                    <span className="stage-number">{idx + 1}</span>
                    <span className="stage-name">{stage.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="popup-section">
              <h4>Learning Resources</h4>
              <div className="popup-resources">
                {selectedRole.learningResources.slice(0, 3).map((resource, idx) => (
                  <a 
                    href={resource.url || 'https://coursera.org'} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="popup-resource-link"
                    key={idx}
                  >
                    📚 {resource.title || 'Professional Course'}
                  </a>
                ))}
              </div>
            </div>

            <div className="popup-details-grid">
              <div className="popup-detail">
                <span className="detail-label">Education:</span>
                <span>{selectedRole.educationRequired}</span>
              </div>
              <div className="popup-detail">
                <span className="detail-label">Salary:</span>
                <span>₹{(selectedRole.averageSalary.min/100000).toFixed(1)}-{(selectedRole.averageSalary.max/100000).toFixed(1)} LPA</span>
              </div>
              <div className="popup-detail">
                <span className="detail-label">Job Outlook:</span>
                <span>{selectedRole.jobOutlook}</span>
              </div>
              <div className="popup-detail">
                <span className="detail-label">Entrance Exams:</span>
                <span>{selectedRole.entranceExams.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            <a 
              href="https://coursera.org" 
              target="_blank" 
              rel="noreferrer" 
              className="popup-explore-btn"
            >
              Explore This Career Path
            </a>
          </div>
        </div>
      )}

      {userProfile && (
        <div className="cm-refresh-note">
          <p><strong>Last updated:</strong> {new Date(userProfile.assessmentResults?.lastUpdated || Date.now()).toLocaleDateString()}</p>
          <p>Retake assessments to get updated recommendations</p>
        </div>
      )}
    </div>
  );
};

export default CareerMatches;