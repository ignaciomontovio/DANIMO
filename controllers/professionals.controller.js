import * as service from '../services/professionals.service.js';
import {
    validateRegisterInputProf,
    validateLoginInputProf,
    validateGoogleTokenProf,
    validateAuthorizeProf,
    validateForgotPassword, validateResetPassword, validateToken,
    validateUpdateInput, validateLinkUser, validateEmailBody
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

export const linkUser = async (req, res) => {
    const { error, value } = validateLinkUser(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const professionalId = req.userId;
        const response = await service.linkUser(professionalId, value.token);
        console.log("✅ El token " + value.token + " es un token válido.")
        res.json({ response });
    } catch (err) {
        console.error(`❌ Token ${value.token} inválido:`, err);
        res.status(500).json({ error: err.message });
    }
}

export const validateProfessionalEmail = async (req, res) => {
    const { error, value } = validateEmailBody(req.body);
    if (error) {
        console.error("❌ Error de validación Joi:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const email = value.email;
    const tokenProfessionalId = req.userId;

    try {
        const professional = await service.findProfessionalByEmail(email);

        if (!professional) {
            console.warn(`⚠️ Profesional con email ${email} no encontrado en la base de datos`);
            return res.status(404).json({ error: "Profesional no encontrado en la base de datos" });
        }

        if (professional.id !== tokenProfessionalId) {
            console.warn(`⛔ Mismatch: professionalId del token (${tokenProfessionalId}) y email  no coincide con el professionalId del email (${professional.id})`);
            return res.status(403).json({ error: "El usuario autenticado no coincide con el email proporcionado" });
        }

        console.log("✅ Validación exitosa: el email corresponde al profesional autenticado.");
        return res.status(200).json({ message: "Validación exitosa. El email corresponde al profesional autenticado con el token." });
    } catch (err) {
        console.error("❌ Error interno validando email con token:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getProfessionalProfile = async (req, res) => {
    const userId = req.userId; // obtenido del middleware

    try {
        const profile = await service.getProfessionalProfile(userId);
        console.log("✅ Perfil de usuario obtenido correctamente.");
        res.status(200).json(profile);
    } catch (err) {
        console.error("❌ Error al obtener el perfil de profesional:", err.message);
        res.status(500).json({ error: "No se pudo obtener el perfil del profesional" });
    }
};

export const getProfessionalPatients = async (req, res) => {
    const professionalId = req.userId;

    try {
        const patients = await service.getProfessionalPatients(professionalId);
        console.log(`✅ Pacientes obtenidos para profesional ${professionalId}`);
        res.status(200).json(patients);
    } catch (err) {
        console.error(`❌ Error al obtener pacientes para el profesional ${professionalId}:`, err);
        res.status(500).json({ error: 'Error al obtener los pacientes' });
    }
};

export const getPatientDetailByEmail = async (req, res) => {
    const { error, value } = validateEmailBody(req.body);
    if (error) {
        console.error("❌ Error de validación Joi:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const professionalId = req.userId;
    const email = value.email;

    try {
        const patient = await service.getPatientDetailByEmail(professionalId, email);
        console.log(`✅ Paciente con email ${email} encontrado`);
        return res.status(200).json(patient);
    } catch (err) {
        console.error(`❌ Error al obtener paciente con email ${email}:`, err.message);
        return res.status(404).json({ error: err.message });
    }
};