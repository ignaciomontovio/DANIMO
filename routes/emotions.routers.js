import express from 'express';
import * as controller from '../controllers/emotions.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', authMiddleware, controller.createEmotionRegister);
router.get('/predominant', authMiddleware, controller.getPredominantEmotion);
router.get('/types', controller.getTypeEmotions);
router.get('/obtain', authMiddleware, controller.getAllEmotionRegisters);

export default router;
