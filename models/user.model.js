const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 2,
        select: false
    },
});

userSchema.pre('save', async function(next) {
    // only run if password was actually modified
    if (!this.isModified('password')) return next();

    // hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = mongoose.model('User', userSchema);