// routes/auth.js
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');

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
        email: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(5).max(15).required(),
    });
    return schema.validate(data);
};

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
};

const findUserByEmail = async (email) => {
    return await Users.findOne({where: {email}});
};

const createUser = async ({firstName, lastName, email, password}) => {
    return await Users.create({
        id: `U-${uuidv4()}`,
        firstName,
        lastName,
        email,
        password,
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
        name: payload.name,
        picture: payload.picture,
    };
};

// === Rutas ===

// Registro de usuario
router.post('/register', async (req, res) => {
    const {error} = validateRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const {firstName, lastName, email, password} = req.body;

    try {
        const userFound = await findUserByEmail(email);
        if (userFound) {
            return res.status(400).json({error: 'Users ya existe.'});
        }

        const passwordHash = await hashPassword(password);
        await createUser({firstName, lastName, email, passwordHash});

        res.json({message: '¡Users registrado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /register:', err);
        return res.status(500).json({error: 'Error al registrar usuario'});
    }
});

// Login de usuario (por completar)
router.post('/login', async (req, res) => {
    const {error} = validateLoginInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const {user, password} = req.body;
    const existingUser = await findUserByEmail(usuario);
    if (!existingUser) {
        return res.status(400).json({error: 'Users inexistente.'});
    }
    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
        return res.status(400).json({error: 'Contraseña incorrecta.'});
    }
    const token = jwt.sign({user: existingUser.user}, process.env.JWT_SECRET, {
        expiresIn: '1000h',
        algorithm: 'HS256'
    })
    return res.status(200).json({error: 'Login completado con exito. Token: ' + token});
});

// Login con Google
router.post('/google', async (req, res) => {
    const {googleJWT} = req.body;
    try {
        const schema = Joi.object({
            googleJWT: Joi.string().required(),
        });
        if (schema.validate(data)) {
            return res.status(400).json({error: error.details[0].message});
        }

        const userData = await verifyGoogleToken(googleJWT);
        console.log('✅ Users verificado con Google:', userData);
        res.json(userData);
    } catch (err) {
        console.error('❌ Error al verificar token de Google:', err);
        res.status(401).json({error: 'Token inválido'});
    }
});

module.exports = router;
