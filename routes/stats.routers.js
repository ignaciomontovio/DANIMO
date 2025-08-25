import express from 'express';
import * as controller from '../controllers/stats.controller.js';
import { authMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/emotions', authMiddleware, controller.getEmotionsStats);
router.post('/week', authMiddleware, controller.getWeeklyEmotions);
router.post('/month', authMiddleware, controller.getEmotionsMonth);
router.post('/year', authMiddleware, controller.getYearStats);
router.post('/important-events', authMiddleware, controller.getImportantEvents);

export default router;
