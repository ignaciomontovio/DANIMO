const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const professionals = require('../models/Professionals');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === Helpers ===
const validateRegisterInput = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(5).max(15).required(),
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
};
const validateLoginInput = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(40).required(),
        password: Joi.string().min(5).max(15).required(),
    });
    return schema.validate(data);
};
const validateGoogleToken = (data) => {
    const schema = Joi.object({
        googleJWT: Joi.required()
    });
    return schema.validate(data);
};
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const findUserByEmail = async (email) => {
    return await Users.findOne({ where: { email } });
};

