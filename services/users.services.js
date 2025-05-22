const Users = require('../models/Users');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken, signRefreshToken } = require('../utils/jwt'); // ⬅️ se importa también signRefreshToken
const { verifyGoogleToken } = require('../utils/google');
const { isAdult } = require('../utils/date');
const { date } = require('joi');

const findUserByEmail = async (email) => {
    return await Users.findOne({ where: { email } });
};

exports.registerUser = async ({ firstName, lastName, email, password, birthDate, gender }) => {
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
        hasGoogleAccount: false,
        ...(birthDate && { birthDate}),
        gender
    });

    return '¡Usuario registrado correctamente!';
};

exports.loginUser = async ({ email, password }, res) => { // ⬅️ pasamos también `res`
    const user = await findUserByEmail(email);
    if (!user) throw new Error('Usuario inexistente.');
    if (user.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    const accessToken = signToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    // 🔸 NUEVO: guardamos refresh token en cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    return accessToken;
};

exports.googleLogin = async (googleJWT) => {
    const userData = await verifyGoogleToken(googleJWT);
    const { firstName, lastName, email } = userData;

    let user = await findUserByEmail(email);

    if (!user) {
        user = await Users.create({
            id: `U-${uuidv4()}`,
            firstName,
            lastName,
            email,
            hasGoogleAccount: true,
            ...(birthDate && { birthDate}), 
            gender
        });

        return { message: '¡Usuario registrado con Google!', token: signToken({ user: user.user }) };
    }

    return { message: 'Login con Google exitoso', token: signToken({ user: user.user }) };
};
