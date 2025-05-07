const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /register
router.post('/register', async (req, res) => {
    const { nombre, apellido, dni, password } = req.body;

    try {
        // Crear usuario con hash
        await crearUsuario(nombre, apellido, dni, await hashPassword(password));

        res.json({ mensaje: '¡Usuario registrado correctamente!' });
    } catch (error) {
        console.error('❌ Error en /register:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

module.exports = router;

// Función para crear el usuario en la base de datos
async function crearUsuario(nombre, apellido, dni, passwordHash) {
    try {
        const Usuario = require('../models/Usuario');
        const nuevoUsuario = await Usuario.create({
            id: "U-" + uuidv4(),
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            password: passwordHash,
        });

        console.log('✅ Usuario creado:', nuevoUsuario.toJSON());
    } catch (error) {
        throw error;
    }
}

// Función para hashear la contraseña
async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, 10);
}

router.post('/login', async (req, res) => {
    const {usuario, password} = req.body

    Usuario



});

router.post('/google', async (req, res) => {
    const {googleJWT} = req.body
    console.log(process.env.GOOGLE_CLIENT_ID)
    if(googleJWT  === undefined)
        console.log("token nook " + googleJWT)

    console.log(verificarTokenGoogle(googleJWT))

});



async function verificarTokenGoogle(idToken) {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // debe coincidir con el del frontend
    });

    const payload = ticket.getPayload();
    return {
        id: payload.sub,               // ID único del usuario en Google
        email: payload.email,
        nombre: payload.name,
        foto: payload.picture
    };
}