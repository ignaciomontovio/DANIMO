import express from 'express';
import * as smsController from '../controllers/sms.controllers.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/send-message', authMiddleware, smsController.sendMessage);

export default router;
