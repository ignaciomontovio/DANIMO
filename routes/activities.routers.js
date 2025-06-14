const express = require('express');
const router = express.Router();
const controller = require('../controllers/activities.controller');

router.get('/types', controller.getTypeActivities);

module.exports = router;