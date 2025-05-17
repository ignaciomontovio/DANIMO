const Users = require('../models/Users');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { verifyGoogleToken } = require('../utils/google');

const findUserByEmail = async (email) => {
    return await Users.findOne({ where: { email } });
};

exports.registerUser = async ({ firstName, lastName, email, password }) => {
    const userExists = await findUserByEmail(email);
    if (userExists) throw new Error('Usuario ya existe.');

    const passwordHash = await hashPassword(password);

    await Users.create({
        id: `U-${uuidv4()}`,
        firstName,
        lastName,
        email,
        password: passwordHash,
        hasGoogleAccount: false
    });

    return '¡Usuario registrado correctamente!';
};

exports.loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('Usuario inexistente.');
    if (user.hasGoogleAccount) throw new Error('Solo puede iniciar sesión con Google.');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    return signToken({ user: user.user });
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
            hasGoogleAccount: true
        });

        return { message: '¡Usuario registrado con Google!', token: signToken({ user: user.user }) };
    }

    return { message: 'Login con Google exitoso', token: signToken({ user: user.user }) };
};
