const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stepsToReproduce: {
        type: String
    },
    expectedResult: {
        type: String
    },
    actualResult: {
        type: String
    },
    severity: {
        type: String,
        enum: ['low', 'minor', 'major', 'critical'],
        required: true,
        default: 'low'
    },
    url: {
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Bug', bugSchema);