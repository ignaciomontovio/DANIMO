import express from 'express';
import * as controller from '../controllers/sleeps.controller.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', middleware, controller.createSleepRegister);
router.get('/obtain', middleware, controller.getAllSleepRegisters);

export default router;
