import admin from 'firebase-admin'
import serviceAccount from '#json' with { type: 'json' };
import cron from 'node-cron'
import Users from '../models/Users.js'

export function registerFirebaseToken(userId, token) {
    Users.update(
        { firebaseToken: token },
        { where: { id: userId } }
    );
}


export function notificationServiceInitialize() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export function sendPushNotificationToUser(userId) {
    const title = "Titulo de prueba"
    const body = "Cuerpo de prueba";
    return Users.findOne({where: {id: userId}, attributes: ['firebaseToken']})
        .then(user => {
            if (!user || !user.firebaseToken) {
                throw new Error('User not found or no firebase token available');
            }
            return sendPushNotification(user.firebaseToken, title, body);
        });
}

const sendPushNotification = (token, title, body) => {
    const message = {
        notification: { title, body },
        token,
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