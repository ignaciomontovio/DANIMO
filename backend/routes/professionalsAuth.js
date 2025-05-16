const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Professionals = require('../models/Professionals');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === Helpers ===
const validateRegisterInput = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(5).max(15).required(),
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        profession: Joi.string().valid('Psicologo', 'Psiquiatra').required()
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
const findProfessionalByEmail = async (email) => {
    return await Professionals.findOne({ where: { email } });
};

const createProfessional = async ({firstName, lastName, email, passwordHash}) => {
    return await Professionals.create({
        id: `U-${uuidv4()}`,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
        hasGoogleAccount: false //No se registró usando login google
    });
};

const createProfessionalGoogleAccount = async ({firstName, lastName, email}) => {
    return await Professionals.create({
        id: `U-${uuidv4()}`,
        firstName: firstName,
        lastName: lastName,
        email: email,
        hasGoogleAccount: true //Se registró usando login google
    });
};

const verifyGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        id: payload.sub,
        email: payload.email,
        picture: payload.picture,
        firstName: payload.given_name,
        lastName: payload.family_name
    };
};

// === Rutas ===

// Registro de profesional

// Login de profesional

// // Login con Google
module.exports = router;