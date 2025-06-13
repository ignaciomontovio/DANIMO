
const usersService = require('../services/users.services');
const { validateRegisterInput, validateLoginInput, validateGoogleToken, validateForgotPassword, validateResetPassword, validateUpdateInput,
    validateToken
} = require('../utils/validators');
const { signToken, verifyToken, signRefreshToken } = require('../utils/jwt');
const {token} = require("mysql/lib/protocol/Auth"); // NO SE SI ESTA BIEN IMPORTAR ESTO, PERO NO ANDA SI NO LO HAGO

exports.validateToken = async (req, res) => {
    const { error } = validateToken(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const response = await usersService.validateToken(req.body);
        res.json({ response });
    } catch (err) {
        console.error('❌ Invalid token:', err);
        res.status(500).json({ error: err.message });
    }
}

exports.registerUser = async (req, res) => {
    const { error, value } = validateRegisterInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const message = await usersService.registerUser(value);
        res.json({ message });
    } catch (err) {
        console.error('❌ Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { error, value } = validateLoginInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const token = await usersService.loginUser(value, res); // ⬅️ pasamos `res`
        res.status(200).json({ message: 'Login completado con éxito', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 🔸 NUEVO controlador
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No se encontró refresh token' });
    }

    try {
        const decoded = verifyToken(refreshToken);
        const newAccessToken = signToken({ userId: decoded.userId });
        res.status(200).json({ message: 'Refresh token obtenido con éxito',token: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }
};

exports.googleLogin = async (req, res) => {
    const { error } = validateGoogleToken(req.body);
    if (error) return res.status(400).json({ error: 'Token inválido' });

    try {
        const result = await usersService.googleLogin(req.body.googleJWT);
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Google login error:', err);
        res.status(401).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { error, value } = validateForgotPassword(req.body);
    if (error) return res.status(400).json({ error: 'Email invalido' });

    try {
        const result = await usersService.forgotPassword(value.email);
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error recuperando contraseña:', err);
        res.status(401).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { error, value } = validateResetPassword(req.body);
    if (error) return res.status(400).json({ error: 'token o contrasena invalida' });
    try {
        const {tokenId, password} = value
        const result = await usersService.resetPassword(tokenId, password);
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error reseteando contraseña:', err);
        res.status(401).json({ error: err.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { error } = validateUpdateInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const userId = req.userId; // viene del middleware
        const updates = req.body;

        await usersService.updateUserProfile(userId, updates);
        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);
        res.status(500).json({ error: 'No se pudo actualizar el perfil' });
    }
};