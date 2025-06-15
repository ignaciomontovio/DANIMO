import express from 'express';
import * as controller from '../controllers/medications.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', authMiddleware, controller.createMedication);

router.get('/obtain', authMiddleware, controller.getActiveMedications);

export default router;
