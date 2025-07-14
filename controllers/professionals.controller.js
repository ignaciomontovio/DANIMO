import * as service from '../services/professionals.service.js';
import {
    validateRegisterInputProf,
    validateLoginInputProf,
    validateGoogleTokenProf,
    validateAuthorizeProf,
    validateForgotPassword, validateResetPassword, validateToken,
    validateUpdateInput
} from '../utils/validators.js';

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

export const forgotPassword = async (req, res) => {
    const { error, value } = validateForgotPassword(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: 'Email invalido' });
    }

    try {
        const result = await service.forgotPassword(value.email);
        console.log("✅ Email de recuperación de contraseña enviado con éxito. ")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error recuperando contraseña:', err);
        res.status(401).json({ error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { error, value } = validateResetPassword(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: 'token o contrasena invalida' });
    }
    try {
        const {tokenId, password} = value
        const result = await service.resetPassword(tokenId, password);
        console.log("✅ Contraseña cambiada con éxito")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error reseteando contraseña:', err);
        res.status(401).json({ error: err.message });
    }
};

export const validateTokenController = async (req, res) => {
    const { error, value } = validateToken(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const response = await service.validateToken(value);
        console.log("✅ El token " + value.tokenId + " es un token válido.")
        res.json({ response });
    } catch (err) {
        console.error('❌ Token inválido:', err);
        res.status(500).json({ error: err.message });
    }
}

export const updateProfessionalProfile = async (req, res) => {
    const { error } = validateUpdateInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const userId = req.userId; // viene del middleware
        const updates = req.body;

        // Si hay imagen, convertir a base64 para guardar como data URI
        //Borrar esto si en el FRONT no funciona
        if (req.file) {
            const mimeType = req.file.mimetype; // ej: 'image/png'
            const base64 = req.file.buffer.toString('base64');
            updates.profilePic = `data:${mimeType};base64,${base64}`;
        }
        //Borrar hasta acá

        await service.updateProfessionalProfile(userId, updates);
        console.log("✅ Perfil actualizado correctamente")
        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);
        res.status(500).json({ error: 'No se pudo actualizar el perfil' });
    }
};