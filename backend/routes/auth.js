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

const createUser = async ({firstName, lastName, email, passwordHash}) => {
    return await Users.create({
        id: `U-${uuidv4()}`,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
        hasGoogleAccount: false //No se registró usando login google
    });
};

const createUserGoogleAccount = async ({firstName, lastName, email}) => {
    return await Users.create({
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
            return res.status(400).json({error: 'Usuario ya existe.'});
        }

        const passwordHash = await hashPassword(password);
        await createUser({firstName, lastName, email, passwordHash});

        res.json({message: '¡Usuario registrado correctamente!'});
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
    const {email, password} = req.body;
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
        return res.status(400).json({error: 'Usuario inexistente.'});
    }
    if (existingUser.hasGoogleAccount){
        return res.status(400).json({error: 'Solo puede iniciar sesion con Google.'});
    }
    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
        return res.status(400).json({error: 'Contraseña incorrecta.'});
    }
    const token = jwt.sign({user: existingUser.user}, process.env.JWT_SECRET, {
        expiresIn: '1000h',
        algorithm: 'HS256'
    })
    return res.status(200).json({message: 'Login completado con exito. Token: ' + token});
});

// Login con Google
router.post('/google', async (req, res) => {
    try {
        const {error} = validateGoogleToken(req.body);
        if (error) {
            return res.status(400).json({error: 'Contraseña incorrecta.'});
        }
        const {googleJWT} = req.body;
        const userData = await verifyGoogleToken(googleJWT);
        console.log('✅ Usuario verificado con Google:', userData);
        const { firstName, lastName, email } = userData;
        
        try {
            const userFound = await findUserByEmail(email);
            if (userFound) {
                const token = jwt.sign({user: userFound.user}, process.env.JWT_SECRET, {
                    expiresIn: '1000h',
                    algorithm: 'HS256'
                })
                return res.status(200).json({message: 'Login completado con exito. Token: ' + token});
            }

            await createUserGoogleAccount({firstName, lastName, email});

            res.json({message: '¡Usuario registrado correctamente con Google!'});
        } catch (err) {
            console.error('❌ Error en /register:', err);
            return res.status(500).json({error: 'Error al registrar usuario con Google'});
        }

    } catch (err) {
        console.error('❌ Error al verificar token de Google:', err);
        res.status(401).json({error: 'Token inválido'});
    }
});

module.exports = router;
