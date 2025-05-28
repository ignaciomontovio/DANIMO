const Users = require('../models/Users');
const RecoveryTokens = require('../models/RecoveryTokens');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken, signRefreshToken } = require('../utils/jwt'); // ⬅️ se importa también signRefreshToken
const { verifyGoogleToken } = require('../utils/google');
const sendEmail = require("../utils/sendEmail");
const TWO_HOURS = 1000 * 60 * 60 * 2;
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

exports.forgotPassword = async ( email ) => { // ⬅️ pasamos también `res`
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).send("Usuario no encontrado");
    const token = "R-"+uuidv4()
    const resetUrl = `https://danimo.onrender.com/reset-password/${token}`;
    await RecoveryTokens.destroy({ where: { userId: user.id } })
    await RecoveryTokens.create({
        tokenId: token,
        expirationDate: Date.now() + TWO_HOURS,
        userId: user.id
    })
    await sendEmail(email, "Recupera tu contraseña", `Haz clic aquí: ${resetUrl}`)
    return "Email enviado con éxito";
};

exports.resetPassword = async ( tokenId, password ) => {
    const recoveryToken = await RecoveryTokens.findOne({ where: { tokenId },
        include: [{
            model: Users, // Hace referencia al modelo de usuarios
            as: 'User'   // Alias definido en la relación, si lo hay
        }]
    })
    if(recoveryToken === null) throw new Error("Token no encontrado");
    const {_, expirationDate} = recoveryToken
    if (expirationDate < Date.now()) throw new Error("Token expirado");
    Users.update(
        { password: await hashPassword(password) },
        { where: { id: recoveryToken.userId } }
    )

    return "Contraseña cambiada con exito";
};

exports.updateUserProfile = async (userId, updates) => {
    const user = await Users.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');

    await user.update(updates);
}