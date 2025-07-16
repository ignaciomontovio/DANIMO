import Professionals from '../models/Professionals.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { verifyGoogleToken } from '../utils/google.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';
import createError from "http-errors";
import { generateRandomKey } from '../utils/jwt.js';
import RecoveryTokensProfessionals from "../models/RecoveryTokensProfessionals.js";
import ProfesionalPatientTokens from "../models/ProfessionalPatientTokens.js";
import Users from "../models/Users.js";
const KEY_SIZE = 16
const SECRET_KEY = process.env.JWT_SECRET
const HOST = process.env.HOST
const TWO_HOURS = 1000 * 60 * 60 * 2;

const findProfessionalByEmail = async (email) => {
    return await Professionals.findOne({ where: { email } });
};

export async function registerProfessional({ firstName, lastName, email, password, birthDate, gender, license, dni }) {
    const existing = await findProfessionalByEmail(email);
    if (existing) throw new Error('Profesional ya existe.');

    //const adult = isAdult({date: birthDate});
    //    if (!adult) throw new Error('Profesional no puede registrarse siendo menor de edad.');

    const passwordHash = await hashPassword(password);
    await Professionals.create({
        id: `U-${uuidv4()}`,
        firstName, lastName, email,
        password: passwordHash,
        hasGoogleAccount: false,
        ...(birthDate && { birthDate}),
        gender,
        license,
        dni,
        authorized: false
    });
    const MSJ = `Nuevo profesional registrado:

    Nombre: ${firstName} ${lastName}
    Email: ${email}
    DNI: ${dni}
    Matrícula: ${license}
    
    Por favor, valide su acceso utilizando los siguientes enlaces:
    
    ✅ Aprobar acceso:
    ${HOST}/auth/professional/approve?email=${email}&key=${generateShortKey(email)}
    
    ❌ Rechazar acceso:
    ${HOST}/auth/professional/revoke?email=${email}&key=${generateShortKey(email)}
    
    Gracias por su colaboración.`

    await sendEmail("danimoapp@gmail.com", "Nuevo profesional registrado", MSJ);

    return '¡Profesional registrado correctamente!';
}

export async function loginProfessional({ email, password }) {
    const professional = await findProfessionalByEmail(email);
    if (!professional) throw new Error('Profesional inexistente.');
    if (professional.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, professional.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    if (!professional.authorized) {
        throw new Error('Su acceso no fue autorizado aún o se ha revocado.');
    }

    return signToken({ userId: professional.id });
}

export async function googleLogin(googleJWT) {
    const userData = await verifyGoogleToken(googleJWT);
    const { email, firstName, lastName } = userData;

    let professional = await findProfessionalByEmail(email);

    if (!professional) {
        professional = await Professionals.create({
            id: `U-${uuidv4()}`,
            firstName, lastName, email,
            hasGoogleAccount: true,
            profession: "Psicologo",
            ...(birthDate && { birthDate}), 
            gender
        });
        return { message: '¡Registrado con Google!', token: signToken({ user: professional.user }) };
    }

    return { message: 'Login con Google exitoso', token: signToken({ user: professional.user }) };
};

export async function setProfessionalAuthorization(email, status, key) {
    const professional = await findProfessionalByEmail(email);
    if (!professional) throw new Error('Profesional no encontrado.');
    if(!validateShortKey(email, key)) throw new Error(`Key ${key} is invalid for email ${email}.`);
    await professional.update({ authorized: status });
}


function generateShortKey(email, secret = SECRET_KEY, length = KEY_SIZE) {
    const hmac = crypto
        .createHmac('sha256', secret)
        .update(email)
        .digest('base64url');

    return hmac.slice(0, length);
}

function validateShortKey(email, keyRecibida, secreto = SECRET_KEY, length = KEY_SIZE) {
    const keyEsperada = generateShortKey(email, secreto, length);
    return keyRecibida === keyEsperada;
}

export async function forgotPassword(email) {
    const professional = await findProfessionalByEmail(email);
    if (!professional) throw createError(404, "Profesional no encontrado");
    const token = generateRandomKey().toUpperCase()
    await RecoveryTokensProfessionals.destroy({where: {professionalId: professional.id}})
    await RecoveryTokensProfessionals.create({
        tokenId: token, expirationDate: Date.now() + TWO_HOURS, professionalId: professional.id
    })
    await sendEmail(email, "Recupera tu contraseña", `Su código de recuperación es ${token}`)
    return "Email enviado con éxito";
}

export async function resetPassword(tokenId, password) {
    const recoveryToken = await RecoveryTokensProfessionals.findOne({
        where: {tokenId: tokenId.toUpperCase()}, include: [{
            model: Professionals, // Hace referencia al modelo de usuarios
            as: 'Professionals'   // Alias definido en la relación, si lo hay
        }]
    })
    if (recoveryToken === null) throw new Error("Token no encontrado");
    const {_, expirationDate} = recoveryToken
    if (expirationDate < Date.now()) throw new Error("Token expirado");
    Professionals.update({password: await hashPassword(password)}, {where: {id: recoveryToken.professionalId}})

    return "Contraseña cambiada con exito";
}

export async function validateToken({tokenId, email}) {
    const recoveryToken = await RecoveryTokensProfessionals.findOne({
        where: {tokenId: tokenId.toUpperCase()},
        include: [{
            model: Professionals, // Modelo de usuarios
            as: 'Professionals'   // Alias definido en la relación
        }]
    })
    if (recoveryToken === null) throw new createError(404, "Token no encontrado");
    if (recoveryToken.Professionals.email !== email) throw new Error("Token no pertenece al profesional o incorrecto.");
    if (recoveryToken.expirationDate < Date.now()) throw new Error("Token expirado");
    return "Token valido"
}

export async function updateProfessionalProfile(userId, updates) {
    const profesional = await Professionals.findByPk(userId);
    if (!profesional) throw new Error('Usuario no encontrado');

    await profesional.update(updates);
}

export async function linkUser(professionalId, token) {
    const userToken = await ProfesionalPatientTokens.findOne({where : {tokenId: token}})
    if (!userToken) throw new Error('Token no válido. Los tokens solo pueden ser utilizados una vez.');
    if (userToken.expirationDate < Date()) throw new Error('Token expirado');
    await ProfesionalPatientTokens.destroy({where: {tokenId: token}})
    const userId = userToken.userId

    const professional = await Professionals.findByPk(professionalId);
    const user = await Users.findByPk(userId);

    // Asocia el usuario al profesional
    await professional.addUser(user);
    return 'Usuario vinculado exitosamente al profesional.'
}
