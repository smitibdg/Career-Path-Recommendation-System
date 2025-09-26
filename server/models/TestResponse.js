const mongoose = require('mongoose');

const TestResponseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ✅ FIX: Add username field for Python model compatibility
    username: { 
        type: String, 
        required: true 
    },
    educationLevel: {
        type: String,
        enum: ['Foundation', 'Intermediate', 'Advanced', 'foundation', 'intermediate', 'advanced', 'bachelors', 'masters', 'doctorate'],
        required: true
    },
    responses: [{
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
        testType: { type: String, required: true }
    }],
    completedAt: {
        type: Date,
        default: Date.now
    },
    // ✅ FIX: Add isActive field for easier querying
    isActive: {
        type: Boolean,
        default: true
    },
    isScored: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

TestResponseSchema.index({ userId: 1, completedAt: -1 });
// ✅ FIX: Add index for faster active document queries
TestResponseSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('TestResponse', TestResponseSchema);