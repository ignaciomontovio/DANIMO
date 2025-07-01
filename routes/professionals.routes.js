import express from 'express';
import * as controller from '../controllers/professionals.controller.js';

const router = express.Router();

router.post('/register', controller.registerProfessional);
router.post('/login', controller.loginProfessional);
router.post('/google', controller.googleLogin);
router.get('/approve', controller.approveProfessional);
router.get('/revoke', controller.revokeProfessional);

export default router;
