const mongoose = require('mongoose');

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
        type: String,
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
    url: {
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        select: false
    },
});

module.exports = mongoose.model('Bug', bugSchema);