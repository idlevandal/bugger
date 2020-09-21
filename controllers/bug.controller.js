const Bug = require('../models/bug.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getBugs = async (req, res) => {
    const bugs = await Bug.find();

    res.status(200).json({
        status: 'success',
        total: bugs.length,
        data: bugs
    })
}

exports.createBug = catchAsync(async (req, res, next) => {
    req.body.reporter = req.user._id;
    const bug = await Bug.create(req.body);

    res.status(201).json({
        status: 'success',
        data: bug
    })
});