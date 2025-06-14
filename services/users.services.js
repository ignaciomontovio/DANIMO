const Users = require('../models/Users');
const RecoveryTokens = require('../models/RecoveryTokens');
const {v4: uuidv4} = require('uuid');
const {hashPassword, comparePassword} = require('../utils/password');
const {signToken, signRefreshToken} = require('../utils/jwt'); // ⬅️ se importa también signRefreshToken
const {verifyGoogleToken} = require('../utils/google');
const sendEmail = require("../utils/sendEmail");
const TWO_HOURS = 1000 * 60 * 60 * 2;
const findUserByEmail = async (email) => {
    return await Users.findOne({where: {email}});
};
const createError = require('http-errors');

const crypto = require('crypto');

exports.validateToken = async ({tokenId, email}) => {
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

exports.registerUser = async ({firstName, lastName, email, password, birthDate, gender}) => {
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
        gender
    });

    return '¡Usuario registrado correctamente!';
};

exports.loginUser = async ({email, password}, res) => { // ⬅️ pasamos también `res`
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

exports.googleLogin = async (googleJWT) => {
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

exports.forgotPassword = async (email) => { // ⬅️ pasamos también `res`
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

exports.resetPassword = async (tokenId, password) => {
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

exports.updateUserProfile = async (userId, updates) => {
    const user = await Users.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');

    await user.update(updates);
}

function generateRandomKey() {
    return crypto.randomBytes(4).toString('hex').slice(0, 6); // 4 bytes son suficientes
}
