//sacar lo que no se vaya a usar
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Users = require('../../models/Users');
const SleepRegisters = require('../../models/SleepRegisters');

module.exports = router;