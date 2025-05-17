const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verifica si viene el token en el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticación faltante o mal formado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica el token usando tu clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Agrega el userId (u otros datos) al objeto `req`
        req.userId = decoded.userId;
        next(); // Continúa con el siguiente middleware o ruta
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;