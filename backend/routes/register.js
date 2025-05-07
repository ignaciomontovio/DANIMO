const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

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
