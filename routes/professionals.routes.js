import express from 'express';
import * as controller from '../controllers/professionals.controller.js';
import {authMiddleware} from '../middleware/middleware.js';
import { upload } from '../utils/uploads.js';
import * as usersController from "../controllers/users.controllers.js";
import {
  linkUser,
  validateProfessionalEmail
} from "../controllers/professionals.controller.js";

const router = express.Router();

router.post('/register', controller.registerProfessional);
router.post('/login', controller.loginProfessional);
router.post('/google', controller.googleLogin);
router.get('/approve', controller.approveProfessional);
router.get('/revoke', controller.revokeProfessional);
router.post('/forgot-password', controller.forgotPassword);
router.post('/validate-token', controller.validateTokenController);
router.post('/reset-password', controller.resetPassword);
//Si lo de la foto no anda, sacar el upload en la ruta de abajo y quitar el import
router.patch('/update-profile', authMiddleware, upload.single('profilePic'), controller.updateProfessionalProfile);
router.post('/link-user', authMiddleware, controller.linkUser);
router.post('/token-email', authMiddleware, controller.validateProfessionalEmail);
router.get('/profile', authMiddleware, controller.getProfessionalProfile);
router.get('/patients', authMiddleware, controller.getProfessionalPatients);
router.post('/patient-detail', authMiddleware, controller.getPatientDetailByEmail);

export default router;
