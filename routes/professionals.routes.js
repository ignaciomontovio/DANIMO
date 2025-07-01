import express from 'express';
import * as controller from '../controllers/professionals.controller.js';

const router = express.Router();

router.post('/registerProf', controller.registerProfessional);
router.post('/loginProf', controller.loginProfessional);
router.post('/googleProf', controller.googleLogin);
router.post('/approve', controller.approveProfessional);
router.post('/revoke', controller.revokeProfessional);

export default router;
