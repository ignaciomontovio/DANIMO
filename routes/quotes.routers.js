const express = require('express');
const router = express.Router();
const controller = require('../controllers/quotes.controller');

router.get('/obtain', controller.getQuote)

module.exports = router;