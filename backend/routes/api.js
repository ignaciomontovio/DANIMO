const express = require('express');
const router = express.Router();

router.get('/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola desde la API!' });
});

module.exports = router;