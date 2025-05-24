const express = require('express');
const router = express.Router();
const controller = require('../controllers/emotions.controller');
const middleware = require('../middleware/middleware'); // importar el middleware

router.post('/entry', middleware, controller.createEmotionRegister)

module.exports = router;