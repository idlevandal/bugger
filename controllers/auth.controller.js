const AppError = require("../utils/appError");

exports.protect = (req, res, next) => {
    let token;

    // express turns header names to lowercase eg Authorizaton becomes authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    console.log(token);

    if (!token) return next(new AppError('You are not logged in!', 401));

    next();
}