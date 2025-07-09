import admin from 'firebase-admin'
import serviceAccount from '#json' with { type: 'json' };
import cron from 'node-cron'
import Users from '../models/Users.js'
const FIREBASE_NOTIFICATION_KEY = process.env.FIREBASE_NOTIFICATION_KEY

export async function registerFirebaseToken(userId, token) {
    return await Users.update(
        {firebaseToken: token},
        {where: {id: userId}}
    );
}

export function notificationServiceInitialize() {
    //const serviceAccount = JSON.parse(
    //    Buffer.from(FIREBASE_NOTIFICATION_KEY, 'base64').toString('utf-8')
    //);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    admin.auth().listUsers(1)
        .then(() => console.log('✅ Admin SDK inicializado correctamente'))
        .catch((err) => console.error('❌ Error al inicializar Admin SDK:', err));
}

export function sendPushNotificationToUser(userId) {
    const title = "Titulo de prueba"
    const body = "Cuerpo de prueba";
    return Users.findOne({where: {id: userId}, attributes: ['firebaseToken']})
        .then(user => {
            if (!user) {
                throw new Error('User not found in database');
            }
            if (!user.firebaseToken) {
                throw new Error('No firebase token available for this user');
            }
            return sendPushNotification(user.firebaseToken, title, body);
        });
}

const sendPushNotification = (token, title, body) => {
    const message = {
        notification: { title, body },
        token,
        data: { screen: "/tabs/home" }
    };

    admin.messaging().send(message)
        .then(response => console.log('Mensaje enviado:', response))
        .catch(error => console.error('Error al enviar mensaje:', error));
};


// Todos los días a las 10:00 AM
cron.schedule('0 10 * * *', async () => {
    // Reemplazá con los tokens registrados de tus usuarios
    const tokens = await Users.findAll({attributes: ['firebaseToken']})

    tokens.forEach(token => {
        sendPushNotification(token, 'Hola!', 'Tu mensaje diario está aquí');
    });
});