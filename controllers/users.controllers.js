const usersService = require('../services/users.services');
const { validateRegisterInput, validateLoginInput, validateGoogleToken } = require('../utils/validators');

exports.registerUser = async (req, res) => {
    const { error } = validateRegisterInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const message = await usersService.registerUser(req.body);
        res.json({ message });
    } catch (err) {
        console.error('❌ Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { error } = validateLoginInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const token = await usersService.loginUser(req.body);
        res.status(200).json({ message: 'Login completado con éxito', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
