const express = require('express');
const router = express.Router();
const controller = require('../controllers/registers.controller');
const middleware = require('../middleware/middleware');

router.post('/create', middleware, controller.createDailyRegister)

module.exports = router;