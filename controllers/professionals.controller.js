const service = require('../services/professionals.service');
const { validateRegisterInputProf, validateLoginInputProf, validateGoogleTokenProf } = require('../utils/validators');

exports.registerProfessional = async (req, res) => {
    const { error, value } = validateRegisterInputProf(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await service.registerProfessional(value);
        console.log("✅ Email " + value.email + " registrado correctamente")
        res.json({ message: result });
    } catch (err) {
        console.error('❌ Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.loginProfessional = async (req, res) => {
    const { error, value } = validateLoginInputProf(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const token = await service.loginProfessional(value);
        console.log("✅ Login completado con éxito para el profesional con email " + value.email)
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.googleLogin = async (req, res) => {
    const { error } = validateGoogleTokenProf(req.body);
    if (error) return res.status(400).json({ error: 'Token inválido' });

    try {
        const result = await service.googleLogin(req.body.googleJWT);
        console.log("✅ Token de google validado con éxito para el profesional")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Google login error:', err);
        res.status(401).json({ error: err.message });
    }
};
