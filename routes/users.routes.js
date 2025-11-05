import express from 'express';
import * as usersController from '../controllers/users.controllers.js';
import {authMiddleware} from '../middleware/middleware.js';
import { upload } from '../utils/uploads.js';
import {resetEmotionalStateByGet} from "../controllers/users.controllers.js";

const router = express.Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/google', usersController.googleLogin);
//router.post('/refresh', usersController.refreshToken);
router.post('/forgot-password', usersController.forgotPassword);
router.post('/validate-token', usersController.validateTokenController);
router.post('/reset-password', usersController.resetPassword);
//Si lo de la foto no anda, sacar el upload en la ruta de abajo y quitar el import
router.patch('/update-profile', authMiddleware, upload.single('profilePic'), usersController.updateUserProfile);
router.post('/token-email', authMiddleware, usersController.validateUserEmail);
router.get('/profile', authMiddleware, usersController.getUserProfile);
router.post('/acceptTerms', authMiddleware, usersController.acceptTerms);
router.get('/redFlags', authMiddleware, usersController.getRedFlags);

router.post('/generate/professional-token', authMiddleware, usersController.generateProfessionalToken);
router.get('/professionals', authMiddleware, usersController.getUserProfessionals);
router.post('/unlink-professional', authMiddleware, usersController.unlinkProfessional);

router.post('/send-email-professional', authMiddleware, usersController.sendEmailToProfessional);
router.delete('/reset', usersController.resetEmotionalState);
router.get('/reset', usersController.resetEmotionalStateByGet);

export default router;
