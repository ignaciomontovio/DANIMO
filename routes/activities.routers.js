import express from 'express';
import * as controller from '../controllers/activities.controller.js';

const router = express.Router();

router.get('/types', controller.getTypeActivities);

export default router;
