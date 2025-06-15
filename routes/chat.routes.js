import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/chat', middleware, chatController.chatController);

export default router;
