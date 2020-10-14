const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user.model');
const sendEmail = require('../utils/email');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new AppError('There is no user with that email address.', 401));
    }     
    
    // generate the random token - done in the model 😉
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    
    // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}
    // If you didn't forget your password please ignore this email!`;
    
    try {
        // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
        // hard code https, req.protocol is returning http when using heroku
        const resetUrl = `https://${req.get('host')}/users/resetPassword/${resetToken}`;
        // await new Email(user, resetUrl).sendPasswordReset();
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 24hrs)',
            message: `Please click on the link to reset your password.
${resetUrl}`
        })
    
        res.status(200).json({
            status: 'success',
            url: resetUrl,
            resetToken: resetToken,
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('There was an error sending the reset email. Try again later', 500));
    }
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
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    req.user = currentUser;

    next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is a user, set the new password
    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    user.password = req.body.password;
    // user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for user

    // 4) Log the user in, send JWT
    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
    // createSendToken(user, 200, res);
});