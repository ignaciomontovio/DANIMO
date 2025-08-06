import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, chatController.chatController);

router.post('/weeklySummary', authMiddleware, chatController.weeklySummaryController);

router.post('/historicalSummary', authMiddleware, chatController.historicalSummaryController);

router.post('/summary', authMiddleware, chatController.summaryController);

export default router;
