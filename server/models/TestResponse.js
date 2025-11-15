const mongoose = require('mongoose');

const testResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  educationLevel: {
    type: String,
    enum: [
      // Foundation Level
      'intermediate-10th', 'intermediate-11th', 'intermediate-12th',
      '10th', '11th', '12th', 'highschool',
      
      // Intermediate Level
      'diploma', 'bachelors', 'bachelor', 'graduation', 'intermediate',
      
      // Advanced Level
      'masters', 'master', 'phd', 'doctorate', 'postgraduate', 'advanced',
      
      // Legacy values (for existing data)
      'foundation', 'Foundation', 'Intermediate', 'Advanced'
    ],
    default: 'intermediate'
  },
  responses: [{
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed, // Can be String or Number
      required: true
    },
    testType: {
      type: String,
      enum: ['Personality', 'Skills', 'Cognitive', 'Situational', 'Values'],
      required: true
    },
    responseTime: {
      type: Number, // milliseconds
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isScored: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  scores: {
    personality: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    cognitive: { type: Number, default: 0 },
    situational: { type: Number, default: 0 },
    values: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
testResponseSchema.index({ userId: 1, isActive: 1 });
testResponseSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('TestResponse', testResponseSchema);