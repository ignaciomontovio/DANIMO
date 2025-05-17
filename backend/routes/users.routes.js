const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/google', usersController.googleLogin);

module.exports = router;