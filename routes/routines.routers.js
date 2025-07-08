import express from 'express';
import * as controller from '../controllers/routines.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.get('/obtain', authMiddleware, controller.obtainRoutines);
router.post('/create', authMiddleware, controller.createRoutine);
router.patch('/update', authMiddleware, controller.updateRoutine);
router.delete('/delete', authMiddleware, controller.deleteRoutine);

export default router;