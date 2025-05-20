const Professionals = require('../models/Professionals');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { verifyGoogleToken } = require('../utils/google');
const { v4: uuidv4 } = require('uuid');
const { isAdult } = require('../utils/date');

const findProfessionalByEmail = async (email) => {
    return await Professionals.findOne({ where: { email } });
};

exports.registerProfessional = async ({ firstName, lastName, email, password, profession, birthDate, gender }) => {
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
};

exports.loginProfessional = async ({ email, password }) => {
    const professional = await findProfessionalByEmail(email);
    if (!professional) throw new Error('Profesional inexistente.');
    if (professional.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, professional.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    return signToken({ user: professional.user });
};

exports.googleLogin = async (googleJWT) => {
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
