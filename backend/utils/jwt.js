const jwt = require('jsonwebtoken');

exports.signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1000h',
        algorithm: 'HS256'
    });
};