const express = require('express');

const authController = require('../controllers/auth.controller');
const bugContoller = require('../controllers/bug.controller');
const router = express.Router();

// add middleware PROTECT to ALL following routes
router.use(authController.protect);

router.route('/')
    .get(bugContoller.getBugs)
    .post(bugContoller.createBug);

router.route('/:id')
    .delete(bugContoller.deleteBug)
    .patch(bugContoller.updateBug);
    

module.exports = router;