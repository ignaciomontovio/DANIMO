import Users from '../models/Users.js';
import RecoveryTokens from '../models/RecoveryTokens.js';
import ProfesionalPatientTokens from "../models/ProfessionalPatientTokens.js";
import {v4 as uuidv4} from 'uuid';
import {comparePassword, hashPassword} from '../utils/password.js';
import {generateRandomKey, signToken} from '../utils/jwt.js';
import {verifyGoogleToken} from '../utils/google.js';
import {sendEmail} from '../utils/sendEmail.js';
import createError from 'http-errors';
import Professionals from '../models/Professionals.js';
import UsersEmotionalState from '../models/UsersEmotionalState.js';
import {Op, where} from 'sequelize';
import Conversations from "../models/Conversations.js";
import EmotionRegisters from "../models/EmotionRegisters.js";
import SleepRegisters from "../models/SleepRegisters.js";
import ActivityRegisters from "../models/ActivityRegisters.js";
import {contactWithProfessionalMessage} from "../utils/defaultMessages.js";
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";

export async function getUserData(email) {
    console.log("Buscando datos del usuario con email: " + email);
    const user = await Users.findOne({
        where: { email },
        attributes: ['id', 'firstName', 'lastName', 'email', 'birthDate', 'gender'] // especifica los campos que necesitas
    });

    const importantEvents = await ImportantEvents.findAll({
            where: {userId: user.id}
        }
    )

    const moodAlternators = await MoodAlternators.findAll({
            where: {userId: user.id}
        }
    )
    console.log("Se han encontrado los datos del usuario: ", user);

    return {
        ...user.toJSON(),
        ImportantEvents: importantEvents,
        MoodAlternators: moodAlternators
    };
}


export async function sendEmailToProfessional(userId) {
    const user = await Users.findByPk(userId, {
        include: [{
            model: Professionals,
            as: 'Professionals', // 👈 Este alias es obligatorio por esta definido así en el modelo
            attributes: ['email', 'occupation'],
            through: { attributes: [] } // 👈 Esto oculta la tabla intermedia
        }]
    });
    if (!user) {
        throw new Error('El usuario no existe.');
    }
    const bodyMessage = contactWithProfessionalMessage(user.firstName, user.lastName)
    const subject = `Notificación de estado emocional – ${user.firstName} ${user.lastName}`
    const professionals = user.Professionals
    if(!professionals) {
        throw new Error('El usuario no tiene profesionales asociados.');
    }
    for (const professional of professionals) {
        await sendEmail(professional.email, subject, bodyMessage);
    }
    return "Email enviado con éxito";
}


const TWO_HOURS = 1000 * 60 * 60 * 2;
const findUserByEmail = async (email) => {
    return await Users.findOne({where: {email}});
};

export async function validateToken({tokenId, email}) {
    const recoveryToken = await RecoveryTokens.findOne({
        where: {tokenId: tokenId.toUpperCase()},
        include: [{
            model: Users, // Modelo de usuarios
            as: 'User'   // Alias definido en la relación
        }]
    })
    if (recoveryToken === null) throw new createError(404, "Token no encontrado");
    if (recoveryToken.User.email !== email) throw new Error("Token no pertenece al usuario o incorrecto.");
    if (recoveryToken.expirationDate < Date.now()) throw new Error("Token expirado");
    return "Token valido"
}

export async function registerUser({firstName, lastName, email, password, birthDate, gender}) {
    const userExists = await findUserByEmail(email);
    if (userExists) throw new Error('Usuario ya existe.');

    //const adult = isAdult({date: birthDate});
    //if (!adult) throw new Error('Usuario no puede registrarse siendo menor de edad.');

    const passwordHash = await hashPassword(password);

    await Users.create({
        id: `U-${uuidv4()}`,
        firstName,
        lastName,
        email,
        password: passwordHash,
        hasGoogleAccount: false, ...(birthDate && {birthDate}),
        gender,
        hasAcceptedTerms: false
    });

    return '¡Usuario registrado correctamente!';
};

export async function loginUser({email, password}) {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('Usuario inexistente.');
    if (user.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    return signToken({userId: user.id});
    //const refreshToken = signRefreshToken({userId: user.id});
    // 🔸 NUEVO: guardamos refresh token en cookie
    //res.cookie('refreshToken', refreshToken, {
    //    httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    //});
};

export async function googleLogin(googleJWT) {
    const userData = await verifyGoogleToken(googleJWT);
    const {firstName, lastName, email} = userData;

    let user = await findUserByEmail(email);

    if (!user) {
        user = await Users.create({
            id: `U-${uuidv4()}`,
            firstName,
            lastName,
            email,
            hasGoogleAccount: true, ...(birthDate && {birthDate}),
            gender
        });

        return {message: '¡Usuario registrado con Google!', token: signToken({user: user.user})};
    }

    return {message: 'Login con Google exitoso', token: signToken({user: user.user})};
};

export async function forgotPassword(email) { // ⬅️ pasamos también `res`
    const user = await findUserByEmail(email);
    if (!user) throw createError(404, "Usuario no encontrado");
    const token = generateRandomKey().toUpperCase()
    await RecoveryTokens.destroy({where: {userId: user.id}})
    await RecoveryTokens.create({
        tokenId: token, expirationDate: Date.now() + TWO_HOURS, userId: user.id
    })
    await sendEmail(email, "Recupera tu contraseña", `Su código de recuperación es ${token}`)
    return "Email enviado con éxito";
};

export async function resetPassword(tokenId, password) {
    const recoveryToken = await RecoveryTokens.findOne({
        where: {tokenId: tokenId.toUpperCase()}, include: [{
            model: Users, // Hace referencia al modelo de usuarios
            as: 'User'   // Alias definido en la relación, si lo hay
        }]
    })
    if (recoveryToken === null) throw new Error("Token no encontrado");
    const {_, expirationDate} = recoveryToken
    if (expirationDate < Date.now()) throw new Error("Token expirado");
    Users.update({password: await hashPassword(password)}, {where: {id: recoveryToken.userId}})

    return "Contraseña cambiada con exito";
};

export async function updateUserProfile(userId, updates) {
    const user = await Users.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');

    await user.update(updates);
}

export { findUserByEmail }; // 👈 necesario para usarlo desde el controller

export async function getUserProfile(userId) {
    const user = await Users.findByPk(userId, {
        attributes: ['firstName', 'lastName', 'birthDate', 'gender', 'occupation', 'livesWith', 'profilePic', 'hasAcceptedTerms']
    });

    if (!user) throw new Error('Usuario no encontrado');
    return user;
}

export async function generateProfessionalToken(userId) {
    const key = generateRandomKey().toUpperCase()
    await ProfesionalPatientTokens.destroy({where: {userId}});

    await ProfesionalPatientTokens.create({
        userId: userId, tokenId: key, expirationDate: Date.now() + TWO_HOURS
    })
    return {token: key};
}

export async function getUserProfessionals(userId) {
    const user = await Users.findByPk(userId, {
        include: [{
            model: Professionals,
            as: 'Professionals', // 👈 Este alias es obligatorio por esta definido así en el modelo
            attributes: ['id', 'firstName', 'lastName', 'occupation'],
            through: { attributes: [] } // 👈 Esto oculta la tabla intermedia
        }]
    });

    if (!user) throw new Error('Usuario no encontrado');

    return user.Professionals;
}

export async function unlinkProfessional(professionalId, userId) {
    const user = await Users.findByPk(userId);
    const professional = await Professionals.findByPk(professionalId);

    if (user && professional) {
        await user.removeProfessional(professional); // este método lo genera Sequelize
        console.log('✅ Asociación eliminada correctamente.');
    } else {
        console.log('⚠️ Usuario o profesional no encontrados.');
    }
}

export async function acceptTerms(userId) {
    const user = await Users.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');

    await user.update({hasAcceptedTerms: true});
}

export async function getRedFlags(userId) {
    const user = await Users.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');
    // Calcular rango de fechas: desde hace 24 horas hasta ahora
    const endDate = new Date(); // ahora
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // hace 24 horas
    // Buscar registros de UsersEmotionalState con suicideRiskDetected = true
    const redFlags = await UsersEmotionalState.findAll({
        where: {
            userId,
            suicideRiskDetected: true,
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        attributes: ['suicideRiskDetected']
    });

    return redFlags;
}

export async function resetEmotionalState(email) {
    // Buscar usuario por email
    const user = await findUserByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const userId = user.id;

    // 📌 Fecha actual
    const today = new Date();

    // ⏰ Hoy a las 00hs
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1,
        0, 0, 0, 0
    );

    // ⏰ Hoy a las 23:59:59.999
    const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23, 59, 59, 999
    );

    console.log("🕒 Eliminando registros entre:", startDate, endDate);

     // El orden importa si hay FK, primero los hijos
    const deletedConversations = await Conversations.destroy({
        where: {
            userId,
            messageDate: { [Op.between]: [startDate, endDate] }
        }
    });

    const deletedEmotionRegisters = await EmotionRegisters.destroy({
        where: {
            userId,
            date: { [Op.between]: [startDate, endDate] }
        }
    });

    const deletedSleepRegisters = await SleepRegisters.destroy({
        where: {
            userId,
            date: { [Op.between]: [startDate, endDate] }
        }
    });

    const deletedActivityRegisters = await ActivityRegisters.destroy({
        where: {
            userId,
            date: { [Op.between]: [startDate, endDate] }
        }
    });

    const deletedState = await UsersEmotionalState.destroy({
        where: {
            userId,
            date: { [Op.between]: [startDate, endDate] }
        }
    });

    const deletedMoodAlternator = await MoodAlternators.destroy({
        where: {
            userId,
            date: { [Op.between]: [startDate, endDate] }
        }
    })

    return {
        deletedConversations,
        deletedEmotionRegisters,
        deletedSleepRegisters,
        deletedActivityRegisters,
        deletedState,
        deletedMoodAlternator,
    };
}