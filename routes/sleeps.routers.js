import express from 'express';
import * as controller from '../controllers/sleeps.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', authMiddleware, controller.createSleepRegister);
router.get('/obtain', authMiddleware, controller.getAllSleepRegisters);

export default router;
