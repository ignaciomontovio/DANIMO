const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts.controller');
const middleware = require('../middleware/middleware');

router.post('/create', middleware, controller.createEmergencyContact)

router.get('/obtain', middleware, controller.getEmergencyContacts)

module.exports = router;