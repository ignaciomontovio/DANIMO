import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d', //ahora el token de ingreso expira en 15 minutos
        algorithm: 'HS256'
    });
};

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
        algorithm: 'HS256'
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};