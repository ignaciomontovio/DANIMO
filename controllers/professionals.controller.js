const service = require('../services/professionals.service');
const { validateRegisterInput, validateLoginInput, validateGoogleToken } = require('../utils/validators');

exports.registerProfessional = async (req, res) => {
    const { error } = validateRegisterInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await service.registerProfessional(req.body);
        res.json({ message: result });
    } catch (err) {
        console.error('❌ Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginProfessional = async (req, res) => {
    const { error } = validateLoginInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const token = await service.loginProfessional(req.body);
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.googleLogin = async (req, res) => {
    const { error } = validateGoogleToken(req.body);
    if (error) return res.status(400).json({ error: 'Token inválido' });

    try {
        const result = await service.googleLogin(req.body.googleJWT);
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Google login error:', err);
        res.status(401).json({ error: err.message });
    }
};
