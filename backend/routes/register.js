const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/register', (req, res) => {
    const {nombre, apellido, dni} = req.body;
    crearUsuario(nombre, apellido, dni);
    res.json({mensaje: '¡Hola desde la API!'});
});

module.exports = router;

async function crearUsuario(nombre, apellido, dni) {
    try {
        const Usuario = require('../models/Usuario');
        const nuevoUsuario = await Usuario.create({
            id: "U-" + uuidv4(),
            nombre: nombre,
            apellido: apellido,
            dni: dni
        });

        console.log('✅ Usuario creado:', nuevoUsuario.toJSON());
    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
    }
}