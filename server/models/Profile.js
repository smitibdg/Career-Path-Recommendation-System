const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  educationLevel: {
    type: String,
    enum: ['intermediate-10th', 'intermediate-11th', 'intermediate-12th', 'diploma', 'bachelors', 'masters', 'phd'],
    required: true
  },
  personalityType: {
    type: String,
    enum: ['Extrovert', 'Introvert', 'Ambivert']
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  interests: {
    type: String,
    required: true
  },
  profileCompleted: {
    type: Boolean,
    default: true
  },
  // Assessment-related fields
  assessmentLevel: {
    type: String,
    enum: ['Foundation', 'Intermediate', 'Advanced'],
    default: function() {
      const levelMap = {
        'intermediate-10th': 'Foundation',
        'intermediate-11th': 'Foundation',
        'intermediate-12th': 'Foundation',
        'diploma': 'Intermediate',
        'bachelors': 'Intermediate',
        'masters': 'Advanced',
        'phd': 'Advanced'
      };
      return levelMap[this.educationLevel] || 'Foundation';
    }
  },
  assessmentsCompleted: {
    type: Map,
    of: {
      completed: { type: Boolean, default: false },
      completedAt: Date,
      score: Number,
      responses: [mongoose.Schema.Types.Mixed]
    },
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update assessmentLevel when educationLevel changes
profileSchema.pre('save', function(next) {
  if (this.isModified('educationLevel')) {
    const levelMap = {
      'intermediate-10th': 'Foundation',
      'intermediate-11th': 'Foundation',
      'intermediate-12th': 'Foundation',
      'diploma': 'Intermediate',
      'bachelors': 'Intermediate',
      'masters': 'Advanced',
      'phd': 'Advanced'
    };
    this.assessmentLevel = levelMap[this.educationLevel] || 'Foundation';
  }
  this.updatedAt = new Date();
  next();
});

// Instance method to get question level
profileSchema.methods.getQuestionLevel = function() {
  return this.assessmentLevel;
};

// Instance method to check if assessment is completed
profileSchema.methods.isAssessmentCompleted = function(testType) {
  return this.assessmentsCompleted.get(testType)?.completed || false;
};

// Instance method to get assessment progress
profileSchema.methods.getAssessmentProgress = function() {
  const testTypes = ['Personality', 'Skills', 'Cognitive', 'Situational', 'Values'];
  const progress = {};
  
  testTypes.forEach(testType => {
    const assessment = this.assessmentsCompleted.get(testType);
    progress[testType] = {
      completed: assessment?.completed || false,
      score: assessment?.score || null,
      completedAt: assessment?.completedAt || null
    };
  });
  
  return progress;
};

module.exports = mongoose.model('Profile', profileSchema);