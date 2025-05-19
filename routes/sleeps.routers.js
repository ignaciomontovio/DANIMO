const express = require('express');
const router = express.Router();
const controller = require('../controllers/sleeps.controller');

router.post('/entry', controller.createSleepRegister)

module.exports = router;