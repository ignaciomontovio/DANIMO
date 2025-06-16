import express from 'express';
import * as usersController from '../controllers/users.controllers.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/google', usersController.googleLogin);
//router.post('/refresh', usersController.refreshToken);
router.post('/forgot-password', usersController.forgotPassword);
router.post('/validate-token', usersController.validateTokenController);
router.post('/reset-password', usersController.resetPassword);
router.patch('/update-profile', authMiddleware, usersController.updateUserProfile);
router.post('/token-email', authMiddleware, usersController.validateUserEmail);

export default router;
