const jwt = require('jsonwebtoken');

exports.signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d', //ahora el token de ingreso expira en 15 minutos
        algorithm: 'HS256'
    });
};

// 🔸 NUEVO: función para generar refresh token
exports.signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
        algorithm: 'HS256'
    });
};

// 🔸 NUEVO: función para verificar tokens
exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};