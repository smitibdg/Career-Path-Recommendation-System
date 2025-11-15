const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  educationLevel: {
    type: String,
    enum: [
      // Foundation Level
      'intermediate-10th', 'intermediate-11th', 'intermediate-12th',
      '10th', '11th', '12th',
      
      // Intermediate Level  
      'diploma', 'bachelors', 'bachelor', 'graduation',
      
      // Advanced Level
      'masters', 'master', 'phd', 'doctorate', 'postgraduate'
    ],
    default: 'bachelors'
  },

  assessmentLevel: {
    type: String,
    enum: ['Foundation', 'Intermediate', 'Advanced'],
    default: 'Foundation'
  },

  phoneNumber: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  interests: {
    type: [String],
    default: []
  },
  personalityType: {
    type: String
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },

  careerCluster: {
    type: String,
    enum: ['STEM', 'Business', 'Healthcare', 'Engineering', 'Marketing', 'Finance', 
          'Design', 'Media', 'Sales', 'IT', 'Research', 'Education', 'Service', 
          'Arts', 'Law', 'Consulting'],
    default: null
  },
  predictionConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  
  lastPrediction: {
    type: Date,
    default: null
  },

  careerRole: {
    type: String,
    default: null
  },
  roleConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  lastRolePrediction: {
    type: Date,
    default: null
  },


  // Assessment Results with NEW MODEL 2 & 3 FIELDS
  assessmentResults: {
    // Test Scores from Model 1
    cognitiveScore: { type: Number, default: 0 },
    skillsScore: { type: Number, default: 0 },
    situationalScore: { type: Number, default: 0 },
    valuesScore: { type: Number, default: 0 },
    personalityScore: { type: Number, default: 0 },
    
    // Existing fields
    testScores: { type: mongoose.Schema.Types.Mixed, default: {} },
    personalityDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    careerCluster: { type: mongoose.Schema.Types.Mixed, default: {} },
    careerRecommendations: { type: mongoose.Schema.Types.Mixed, default: [] },
    
    // Model 2 Career Cluster Prediction Results
    model2Results: {
      predictedCareerCluster: {
        type: String,
        enum: ['STEM', 'Business', 'Healthcare', 'Engineering', 'Marketing', 'Finance', 
               'Design', 'Media', 'Sales', 'IT', 'Research', 'Education', 'Service', 
               'Arts', 'Law', 'Consulting'],
        default: null
      },
      predictionConfidence: {
        type: Number,
        min: 0,
        max: 1,
        default: null
      },
      predictionMethod: {
        type: String,
        default: null
      },
      predictionProbabilities: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      lastPredictionDate: {
        type: Date,
        default: null
      }
    },

    // Model 3 Career Role Prediction Results  
    model3Results: {
      predictedCareerRoles: [{
        role: String,
        confidence: Number,
        cluster: String,
        predictedAt: { type: Date, default: Date.now },
        
        // Career Details for Frontend Cards
        requiredSkills: [String],
        educationRequired: String,
        averageSalary: {
          min: Number,
          max: Number,
          currency: { type: String, default: 'INR' }
        },
        jobOutlook: String,
        growthPath: [String],
        learningResources: [{
          title: String,
          url: String,
          type: { type: String, enum: ['Course', 'Certification', 'Book', 'Video', 'Website'] },
          free: Boolean
        }],
        entranceExams: [String],
        recommendedFields: [String]
      }],
      lastRolePredictionDate: {
        type: Date,
        default: null
      }
    },
    
    // Test Completion Tracking for 5 Tests
    testCompletionStatus: {
      personalityTest: { type: Boolean, default: false },
      cognitiveTest: { type: Boolean, default: false },
      skillsTest: { type: Boolean, default: false },
      situationalTest: { type: Boolean, default: false },
      valuesTest: { type: Boolean, default: false }
    },
    
    // Assessment Metadata
    isAssessmentCompleted: { type: Boolean, default: false },
    assessmentCompletedAt: { type: Date },
    modelVersion: { type: String, default: '1.0' },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Helper method to check if all 5 tests are completed
userSchema.methods.allTestsCompleted = function() {
  const tests = this.assessmentResults.testCompletionStatus;
  return tests.personalityTest && tests.cognitiveTest && tests.skillsTest && 
         tests.situationalTest && tests.valuesTest;
};

// Helper method to get test completion percentage
userSchema.methods.getTestCompletionPercentage = function() {
  const tests = this.assessmentResults.testCompletionStatus;
  const completed = Object.values(tests).filter(Boolean).length;
  return Math.round((completed / 5) * 100);
};

// Model 2 prediction
userSchema.methods.hasCareerClusterPrediction = function() {
  return !!(this.assessmentResults.model2Results.predictedCareerCluster);
};

// Model 3
userSchema.methods.hasCareerRolePrediction = function () {
  return !!this.careerRole;
};

// Helper method to get top career roles (for frontend cards)
userSchema.methods.getTopCareerRoles = function(limit = 5) {
  return this.assessmentResults.model3Results.predictedCareerRoles
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

module.exports = mongoose.model('User', userSchema);