import express from 'express';
import * as controller from '../controllers/routines.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.get('/obtain', authMiddleware, controller.obtainRoutines);
router.post('/create', authMiddleware, controller.createRoutine);

export default router;