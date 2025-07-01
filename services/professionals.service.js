import Professionals from '../models/Professionals.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { verifyGoogleToken } from '../utils/google.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';

const KEY_SIZE = 16
const SECRET_KEY = process.env.JWT_SECRET
const HOST = process.env.HOST
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
    const msj = `Se ha registrado un nuevo profesional: ${firstName} ${lastName} con email: 
    ${email}. DNI: ${dni} Matricula: ${license} Por favor, valide su acceso.
    Aprobar: ${HOST}/auth/professional/approve?email=${email}&key=${generateShortKey(email)}
    Rechazar: ${HOST}/auth/professional/revoke?email=${email}&key=${generateShortKey(email)}`

    await sendEmail("danimoapp@gmail.com", "Nuevo profesional registrado", msj);

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

    return signToken({ user: professional.user });
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