const express = require('express');
const router = express.Router();
const controller = require('../controllers/professionals.controller');

router.post('/registerProf', controller.registerProfessional);
router.post('/loginProf', controller.loginProfessional);
router.post('/googleProf', controller.googleLogin);

module.exports = router;
