const mongoose = require('mongoose');

const TestResponseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    isScored: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

TestResponseSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('TestResponse', TestResponseSchema);