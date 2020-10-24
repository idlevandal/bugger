const Bug = require('../models/bug.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getBugs = async (req, res) => {
    const bugs = await Bug.find().lean().populate({
        path: 'reporter',
        select: 'name -_id'
    });

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

exports.deleteBug = catchAsync(async (req, res, next) => {
    const doc = await Bug.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No bug found with that ID',  404));

    res.status(204).json({
        status: 'success'
    })
});

exports.updateBug = catchAsync(async (req, res, next) => {
    
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false // NOT sure if this is necessary
    });

    if (!bug) return next(new AppError('No bug found with that ID', 404));

    res.status(200).json({
        status: 'success',
        message: `Bug with id: ${req.params.id} updated`,
        data: {
            data: bug
        }
    });
});