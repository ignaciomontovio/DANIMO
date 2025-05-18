const express = require('express');
const router = express.Router();
const controller = require('../controllers/activities.controller');

router.post('/entry', controller.createActivityRegister)

module.exports = router;