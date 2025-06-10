const express = require('express');
const router = express.Router();
const controller = require('../controllers/emotions.controller');
const middleware = require('../middleware/middleware'); // importar el middleware

router.post('/entry', middleware, controller.createEmotionRegister)

router.get('/predominant', middleware, controller.getPredominantEmotion);

router.get('/types', controller.getTypeEmotions);

router.get('/obtain', middleware, controller.getAllEmotionRegisters);

module.exports = router;