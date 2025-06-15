import express from 'express';
import * as controller from '../controllers/emotions.controller.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', middleware, controller.createEmotionRegister);
router.get('/predominant', middleware, controller.getPredominantEmotion);
router.get('/types', controller.getTypeEmotions);
router.get('/obtain', middleware, controller.getAllEmotionRegisters);

export default router;
