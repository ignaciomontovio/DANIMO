import Professionals from '../models/Professionals.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { verifyGoogleToken } from '../utils/google.js';
import { v4 as uuidv4 } from 'uuid';

const findProfessionalByEmail = async (email) => {
    return await Professionals.findOne({ where: { email } });
};

export async function registerProfessional({ firstName, lastName, email, password, profession, birthDate, gender }) {
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
        profession: profession,
        ...(birthDate && { birthDate}),
        gender
    });

    return '¡Profesional registrado correctamente!';
}

export async function loginProfessional({ email, password }) {
    const professional = await findProfessionalByEmail(email);
    if (!professional) throw new Error('Profesional inexistente.');
    if (professional.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, professional.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

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
