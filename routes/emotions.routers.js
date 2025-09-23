import express from 'express';
import * as controller from '../controllers/emotions.controller.js';
import {authMiddleware} from '../middleware/middleware.js';
import { upload } from '../utils/uploads.js';

const router = express.Router();

router.post('/entry', authMiddleware, upload.single('photo'), controller.createEmotionRegister);
router.get('/predominant', authMiddleware, controller.getPredominantEmotion);
router.get('/types', controller.getTypeEmotions);
router.get('/obtain', authMiddleware, controller.getAllEmotionRegisters);
router.post('/photo', authMiddleware, upload.single('photo'), controller.detectEmotionFromPhoto);

export default router;
