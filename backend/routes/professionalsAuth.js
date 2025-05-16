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

const createProfessional = async ({firstName, lastName, email, passwordHash, profession}) => {
    return await Professionals.create({
        id: `U-${uuidv4()}`,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
        hasGoogleAccount: false, //No se registró usando login google
        profession: profession
    });
};

const createProfessionalGoogleAccount = async ({firstName, lastName, email}) => {
    return await Professionals.create({
        id: `U-${uuidv4()}`,
        firstName: firstName,
        lastName: lastName,
        email: email,
        hasGoogleAccount: true, //Se registró usando login google
        profession: "Psicologo" //por defecto, despues ver como cambiarlo
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
router.post('/registerProf', async (req, res) => {
    const {error} = validateRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const {firstName, lastName, email, password, profession} = req.body;

    try {
        const professionalFound = await findProfessionalByEmail(email);
        if (professionalFound) {
            return res.status(400).json({error: 'Profesional ya existe.'});
        }

        const passwordHash = await hashPassword(password);
        await createProfessional({firstName, lastName, email, passwordHash, profession});

        res.json({message: '¡Profesional registrado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /register:', err);
        return res.status(500).json({error: 'Error al registrar profesional'});
    }
});

// Login de profesional
router.post('/loginProf', async (req, res) => {
    const {error} = validateLoginInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const {email, password} = req.body;
    const existingProfessional = await findProfessionalByEmail(email);
    if (!existingProfessional) {
        return res.status(400).json({error: 'Profesional inexistente.'});
    }
    // Para cuando este implementado google
    /*if (existingProfessional.hasGoogleAccount){
        return res.status(400).json({error: 'Solo puede iniciar sesion con Google.'});
    }*/
    const isValid = await bcrypt.compare(password, existingProfessional.password);
    if (!isValid) {
        return res.status(400).json({error: 'Contraseña incorrecta.'});
    }
    const token = jwt.sign({user: existingProfessional.user}, process.env.JWT_SECRET, {
        expiresIn: '1000h',
        algorithm: 'HS256'
    })
    return res.status(200).json({message: 'Login completado con exito. Token: ' + token});
});

// // Login con Google
module.exports = router;