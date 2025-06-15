import express from 'express';
import * as smsController from '../controllers/sms.controllers.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/send-message', middleware, smsController.sendMessage);

export default router;
