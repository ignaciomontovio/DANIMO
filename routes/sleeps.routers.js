const express = require('express');
const router = express.Router();
const controller = require('../controllers/sleeps.controller');
const middleware = require('../middleware/middleware'); // importar el middleware

router.post('/entry', middleware, controller.createSleepRegister); // usarlo acá

module.exports = router;