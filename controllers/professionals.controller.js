import * as service from '../services/professionals.service.js';
import { validateRegisterInputProf, validateLoginInputProf, validateGoogleTokenProf, validateAuthorizeProf } from '../utils/validators.js';

export const registerProfessional = async (req, res) => {
    const { error, value } = validateRegisterInputProf(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const result = await service.registerProfessional(value);
        console.log("✅ Email " + value.email + " registrado correctamente")
        res.json({ message: result });
    } catch (err) {
        console.error('❌ Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
};

export const loginProfessional = async (req, res) => {
    const { error, value } = validateLoginInputProf(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const token = await service.loginProfessional(value);
        console.log("✅ Login completado con éxito para el profesional con email " + value.email)
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const googleLogin = async (req, res) => {
    const { error } = validateGoogleTokenProf(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: 'Token inválido' });
    }
    try {
        const result = await service.googleLogin(req.body.googleJWT);
        console.log("✅ Token de google validado con éxito para el profesional")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Google login error:', err);
        res.status(401).json({ error: err.message });
    }
};

export const approveProfessional = async (req, res) => {
    const { error, value } = validateAuthorizeProf(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        await service.setProfessionalAuthorization(value.email, true, value.key);
        console.log(`✅ Profesional ${value.email} aprobado`);
        res.status(200).json({ message: 'Profesional aprobado correctamente.' });
    } catch (err) {
        console.error('❌ Error en approve:', err);
        res.status(500).json({ error: err.message });
    }
};

export const revokeProfessional = async (req, res) => {
    const { error, value } = validateAuthorizeProf(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        await service.setProfessionalAuthorization(value.email, false, value.key);
        console.log(`⛔ Profesional ${value.email} revocado`);
        res.status(200).json({ message: 'Acceso del profesional revocado.' });
    } catch (err) {
        console.error('❌ Error en revoke:', err);
        res.status(500).json({ error: err.message });
    }
};