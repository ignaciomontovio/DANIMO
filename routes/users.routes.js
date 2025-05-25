const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/google', usersController.googleLogin);
router.post('/refresh', usersController.refreshToken);
router.post('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);

module.exports = router;