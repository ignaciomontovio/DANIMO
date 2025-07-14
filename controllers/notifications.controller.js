import * as service from "../services/notifications.services.js";

export const sendNotificationToUser = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await service.sendPushNotificationToUser(userId);
        console.log("✅ Notificacion enviada correctamente al usuario");
        res.json({ message: result });
    } catch (err) {
        console.error('❌ Error al enviar notificacion al usuario :', err);
        res.status(500).json({ error: err.message });
    }
};

export const registerToken = async (req, res) => {
    const {token} = req.body;
    if (!token) {
        console.error("❌ Error: Firebase token is required");
        return res.status(400).json({error: 'Firebase token is required'});
    }
    try {
        const userId = req.userId;
        await service.registerFirebaseToken(userId, token)
        console.log("✅ Token registrado correctamente");
        res.json({message: 'Token registered successfully'});
    } catch (err) {
        console.error('❌ Error al registrar el token:', err);
        res.status(500).json({error: err.message});
    }
}

export const tryPushNotificationService = async (req, res) => {
    try {
        console.log("test")
        const result = await service.tryPushNotificationService();
        console.log(result);
        res.json({message: result});
    } catch (err) {
        console.error('❌ Error al probar el servicio de notificaciones:', err);
        res.status(500).json({error: err.message});
    }
}