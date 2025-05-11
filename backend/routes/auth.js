// routes/auth.js
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');

const Usuario = require('../models/Usuario');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === Helpers ===
const validateRegisterInput = (data) => {
    const schema = Joi.object({
        usuario: Joi.string().alphanum().min(3).max(30).required(),
        contrasena: Joi.string().min(5).max(15).required(),
        nombre: Joi.string().alphanum().min(3).max(30).required(),
        apellido: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
};
const validateLoginInput = (data) => {
    const schema = Joi.object({
        usuario: Joi.string().alphanum().min(3).max(30).required(),
        contrasena: Joi.string().min(5).max(15).required(),
    });
    return schema.validate(data);
};

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
};

const findUsuarioByNombre = async (usuario) => {
    return await Usuario.findOne({where: {usuario}});
};

const crearUsuario = async ({nombre, apellido, usuario, contrasena}) => {
    return await Usuario.create({
        id: `U-${uuidv4()}`,
        nombre,
        apellido,
        usuario,
        contrasena,
    });
};

const verificarTokenGoogle = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        id: payload.sub,
        email: payload.email,
        nombre: payload.name,
        foto: payload.picture,
    };
};

// === Rutas ===

// Registro de usuario
router.post('/register', async (req, res) => {
    const {error} = validateRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const {nombre, apellido, usuario, contrasena} = req.body;

    try {
        const usuarioExistente = await findUsuarioByNombre(usuario);
        if (usuarioExistente) {
            return res.status(400).json({error: 'Usuario ya existe.'});
        }

        const passwordHash = await hashPassword(contrasena);
        await crearUsuario({nombre, apellido, usuario, contrasena: passwordHash});

        res.json({mensaje: '¡Usuario registrado correctamente!'});
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
    const {usuario, contrasena} = req.body;
    const usuarioExistente = await findUsuarioByNombre(usuario);
    if (!usuarioExistente) {
        return res.status(400).json({error: 'Usuario inexistente.'});
    }
    const esValida = await bcrypt.compare(contrasena, usuarioExistente.contrasena);
    if (!esValida) {
        return res.status(400).json({error: 'Contraseña incorrecta.'});
    }

    return res.status(200).json({error: 'Login completado con exito'});
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

        const datosUsuario = await verificarTokenGoogle(googleJWT);
        console.log('✅ Usuario verificado con Google:', datosUsuario);
        res.json(datosUsuario);
    } catch (err) {
        console.error('❌ Error al verificar token de Google:', err);
        res.status(401).json({error: 'Token inválido'});
    }
});

module.exports = router;
