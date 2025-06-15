import express from 'express';
import * as controller from '../controllers/medications.controller.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/entry', middleware, controller.createMedication);

export default router;
