import express from 'express';
import * as controller from '../controllers/contacts.controller.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/create', middleware, controller.createEmergencyContact);
router.get('/obtain', middleware, controller.getEmergencyContacts);
router.patch('/update', middleware, controller.updateEmergencyContact);
router.delete('/delete', middleware, controller.deleteEmergencyContact);
router.post('/button', middleware, controller.emergencyButton);

export default router;
