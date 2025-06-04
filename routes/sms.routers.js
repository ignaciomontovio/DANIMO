const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controllers');
const middleware = require('../middleware/middleware');

router.post('/send-message', middleware, smsController.sendMessage)
module.exports = router;