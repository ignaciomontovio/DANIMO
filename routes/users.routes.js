const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');
const middleware = require('../middleware/middleware');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/google', usersController.googleLogin);
router.post('/refresh', usersController.refreshToken);
router.post('/forgot-password', usersController.forgotPassword);
router.get('/validate-token', usersController.validateToken);
router.post('/reset-password', usersController.resetPassword);
router.patch('/update-profile', middleware, usersController.updateUserProfile);

module.exports = router;