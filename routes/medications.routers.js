const express = require('express');
const router = express.Router();
const controller = require('../controllers/medications.controller');
const middleware = require('../middleware/middleware');

router.post('/entry', middleware, controller.createMedication);

module.exports = router;