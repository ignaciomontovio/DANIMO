const express = require('express');
const router = express.Router();
const controller = require('../controllers/emotions.controller');

router.post('/entry', controller.createEmotionRegister)

module.exports = router;