import * as usersService from '../services/users.services.js';
import {
    validateRegisterInput,
    validateLoginInput,
    validateGoogleToken,
    validateForgotPassword,
    validateResetPassword,
    validateUpdateInput,
    validateToken,
    validateEmailBody,
    validateUnlinkProfessional
} from '../utils/validators.js';

export let sendEmailToProfessional = async (req, res) => {
    const userId = req.userId;
    await usersService.sendEmailToProfessional(userId)
}


export const validateTokenController = async (req, res) => {
    const { error, value } = validateToken(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const response = await usersService.validateToken(value);
        console.log("✅ El token " + value.tokenId + " es un token válido.")
        res.json({ response });
    } catch (err) {
        console.error('❌ Token inválido:', err);
        res.status(500).json({ error: err.message });
    }
}

export const registerUser = async (req, res) => {
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const message = await usersService.registerUser(value);
        console.log("✅ Email " + value.email + " registrado correctamente")
        res.json({ message });
    } catch (err) {
        console.error('❌ Error en /register para email ' + value.email +  ' Error:' + err);
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { error, value } = validateLoginInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const token = await usersService.loginUser(value);
        console.log("✅ Login completado con éxito para el usuario con email " + value.email)
        res.status(200).json({ message: 'Login completado con éxito', token });
    } catch (err) {
        console.error("❌ Error en /login para email " + value.email + " Error: " + err.message)
        res.status(400).json({ error: err.message });
    }
};

// DEJO COMENTADO LO DE REFRESH TOKEN POR EL MOMENTO
/*
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        console.error("Error en validacion de joi Error:" + error.details[0].message)
        return res.status(401).json({ message: 'No se encontró refresh token' });
    }
    try {
        const decoded = verifyToken(refreshToken);
        const newAccessToken = signToken({ userId: decoded.userId });
        console.log("✅ Token refrescado correctamente.")
        res.status(200).json({ message: 'Refresh token obtenido con éxito',token: newAccessToken });
    } catch (err) {
        console.error('❌ Error refresh token:', err);
        return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }
};
*/

export const googleLogin = async (req, res) => {
    const { error } = validateGoogleToken(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: 'Token inválido' });
    }

    try {
        const result = await usersService.googleLogin(req.body.googleJWT);
        console.log("✅ Token de google validado con éxito para el usuario")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error en google login:', err);
        res.status(401).json({ error: err.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { error, value } = validateForgotPassword(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: 'Email invalido' });
    }

    try {
        const result = await usersService.forgotPassword(value.email);
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
        const result = await usersService.resetPassword(tokenId, password);
        console.log("✅ Contraseña cambiada con éxito")
        res.status(200).json(result);
    } catch (err) {
        console.error('❌ Error reseteando contraseña:', err);
        res.status(401).json({ error: err.message });
    }
};

export const updateUserProfile = async (req, res) => {
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

        await usersService.updateUserProfile(userId, updates);
        console.log("✅ Perfil actualizado correctamente")
        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);
        res.status(500).json({ error: 'No se pudo actualizar el perfil' });
    }
};

export const validateUserEmail = async (req, res) => {
    const { error, value } = validateEmailBody(req.body);
    if (error) {
        console.error("❌ Error de validación Joi:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const email = value.email;
    const tokenUserId = req.userId;

    try {
        const user = await usersService.findUserByEmail(email);

        if (!user) {
            console.warn(`⚠️ Usuario con email ${email} no encontrado en la base de datos`);
            return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
        }

        if (user.id !== tokenUserId) {
            console.warn(`⛔ Mismatch: userId del token (${tokenUserId}) no coincide con el userId del email (${user.id})`);
            return res.status(403).json({ error: "El usuario autenticado no coincide con el email proporcionado" });
        }

        console.log("✅ Validación exitosa: el email corresponde al usuario autenticado.");
        return res.status(200).json({ message: "Validación exitosa. El email corresponde al usuario autenticado con el token." });
    } catch (err) {
        console.error("❌ Error interno validando email con token:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getUserProfile = async (req, res) => {
    const userId = req.userId; // obtenido del middleware

    try {
        const profile = await usersService.getUserProfile(userId);
        console.log("✅ Perfil de usuario obtenido correctamente.");
        res.status(200).json(profile);
    } catch (err) {
        console.error("❌ Error al obtener el perfil de usuario:", err.message);
        res.status(500).json({ error: "No se pudo obtener el perfil del usuario" });
    }
};
export const generateProfessionalToken = async (req, res) => {
    const userId = req.userId; // obtenido del middleware

    try {
        const token = await usersService.generateProfessionalToken(userId);
        console.log("✅ Token de vinculacion de profesional generado correctamente.");
        res.status(200).json(token);
    } catch (err) {
        console.error("❌ Error al generar token de vinculacion de profesional:", err.message);
        res.status(500).json({ error: "Error al generar token de vinculacion de profesional" });
    }
};

export const getUserProfessionals = async (req, res) => {
    const userId = req.userId;

    try {
        const professionals = await usersService.getUserProfessionals(userId);
        console.log(`✅ Profesionales obtenidos para usuario ${userId}`);
        res.status(200).json(professionals);
    } catch (err) {
        console.error(`❌ Error al obtener pacientes para el profesional ${userId}:`, err);
        res.status(500).json({ error: 'Error al obtener los pacientes' });
    }
};

export const unlinkProfessional = async (req, res) => {
    const { error, value } = validateUnlinkProfessional(req.body);
    if (error) {
        console.error("❌ Validación fallida:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const professionalId = value.professionalId;
    const userId = req.userId;

    try {
        await usersService.unlinkProfessional(professionalId, userId);
        console.log(`✅ Usuario ${userId} desvinculado correctamente del profesional ${professionalId}`);
        return res.status(200).json({ message: 'Usuario desvinculado correctamente.' });
    } catch (err) {
        console.error(`❌ Error al desvincular usuario:`, err);
        return res.status(500).json({ error: err.message });
    }
};

export const acceptTerms = async (req, res) => {
    const userId = req.userId;
    try {
        await usersService.acceptTerms(userId);
        console.log(`✅ Usuario ${userId} acepto terminos y condiciones`);
        return res.status(200).json({ message: 'Usuario acepto terminos y condiciones correctamente.' });
    } catch (err) {
        console.error(`❌ Error al aceptar terminos y condiciones:`, err);
        return res.status(500).json({ error: err.message });
    }
}

export const getRedFlags = async (req, res) => {
    const userId = req.userId;

    try {
        const redFlags = await usersService.getRedFlags(userId);
        console.log(`✅ Red Flags obtenidas para usuario ${userId}`);
        res.status(200).json(redFlags);
    } catch (err) {
        console.error(`❌ Error al obtener Red Flags para ${userId}:`, err);
        res.status(500).json({ error: 'Error al obtener Red Flags' });
    }
};

export const resetEmotionalState = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        console.error("❌ Email no proporcionado en body");
        return res.status(400).json({ error: "Email es requerido" });
    }

    try {
        const deleted = await usersService.resetEmotionalState(email);

        const totalDeleted =
            deleted.deletedConversations +
            deleted.deletedEmotionRegisters +
            deleted.deletedSleepRegisters +
            deleted.deletedActivityRegisters +
            deleted.deletedState;

        console.log(`🗑️ Registros eliminados: ${totalDeleted}`);

        return res.status(200).json({
            message: totalDeleted > 0
                ? `Se eliminaron ${totalDeleted} registros`
                : "No había registros para eliminar"
        });

    } catch (err) {
        console.error("❌ Error eliminando registros:", err);
        return res.status(500).json({ error: err.message });
    }
};