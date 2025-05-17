const express = require('express');
const router = express.Router();
const controller = require('../controllers/registers.controller');

router.post('/create', controller.createDailyRegister)

module.exports = router;