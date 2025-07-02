import express from 'express';
import * as controller from '../controllers/professionals.controller.js';
import * as usersController from "../controllers/users.controllers.js";

const router = express.Router();

router.post('/register', controller.registerProfessional);
router.post('/login', controller.loginProfessional);
router.post('/google', controller.googleLogin);
router.get('/approve', controller.approveProfessional);
router.get('/revoke', controller.revokeProfessional);
router.post('/forgot-password', controller.forgotPassword);
router.post('/validate-token', controller.validateTokenController);
router.post('/reset-password', controller.resetPassword);

export default router;
