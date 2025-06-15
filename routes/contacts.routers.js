import express from 'express';
import * as controller from '../controllers/contacts.controller.js';
import {authMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, controller.createEmergencyContact);
router.get('/obtain', authMiddleware, controller.getEmergencyContacts);
router.patch('/update', authMiddleware, controller.updateEmergencyContact);
router.delete('/delete', authMiddleware, controller.deleteEmergencyContact);
router.post('/button', authMiddleware, controller.emergencyButton);

export default router;
