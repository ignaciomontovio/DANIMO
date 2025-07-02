import jwt from 'jsonwebtoken';
import crypto from "crypto";

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

export function generateRandomKey() {
    return crypto.randomBytes(4).toString('hex').slice(0, 6); // 4 bytes son suficientes
}