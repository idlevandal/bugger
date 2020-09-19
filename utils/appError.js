class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // custom property that marks errors we create ourselves as isOperational
        this.isOperational = true;

        // preserve stack trace
        // current function call is not added to stack trace so won't polute it.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;