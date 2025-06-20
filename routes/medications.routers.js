import express from 'express';
import * as controller from '../controllers/medications.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', authMiddleware, controller.createMedication);

router.get('/obtain', authMiddleware, controller.getActiveMedications);

router.post('/detail', authMiddleware, controller.getMedicationDetail);

router.patch('/update', authMiddleware, controller.editMedication);

router.post('/delete', authMiddleware, controller.deleteMedication);

export default router;
