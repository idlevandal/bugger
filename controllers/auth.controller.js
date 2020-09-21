const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user.model');

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN
    });

    // TODO update to http only
    // res.cookie('jwt', token);

    res.status(201).json({
        status: 'success',
        token
    })

});

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    if (!newUser) {
        return next(new AppError('Error creating user', 400));
    }

    const token = await jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // express turns header names to lowercase eg Authorizaton becomes authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // } else if (req.cookies && req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }
    if (!token) return next(new AppError('You are not logged in!', 401));

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    req.user = currentUser;

    next();
});