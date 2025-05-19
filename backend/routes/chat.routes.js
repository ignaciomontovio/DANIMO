const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const middleware = require('../middleware/middleware');

router.post('/chat', middleware, chatController.chat);

module.exports = router;