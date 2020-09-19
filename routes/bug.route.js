const express = require('express');

const authController = require('../controllers/auth.controller');
const bugContoller = require('../controllers/bug.controller');
const router = express.Router();

router.route('/')
    .get(authController.protect, bugContoller.getBugs)
    .post(bugContoller.createBug);

module.exports = router;