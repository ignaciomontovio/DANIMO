import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, chatController.chatController);

router.post('/chat/generate', chatController.chatGenerateController);

router.post('/weeklySummary', authMiddleware, chatController.weeklySummaryController);

//REEMPLAZADO POR RANGED SUMMARY
router.post('/historicalSummary', authMiddleware, chatController.historicalSummaryController);

router.post('/summary', authMiddleware, chatController.rangedSummaryController);

router.post("/summary/availableYears", authMiddleware, chatController.summaryAvailableYears)
export default router;
