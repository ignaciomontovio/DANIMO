import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, chatController.chatController);

export default router;
