import express from 'express';
import * as controller from '../controllers/stats.controller.js';
import { authMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/emotions', authMiddleware, controller.getEmotionsStats);

export default router;
