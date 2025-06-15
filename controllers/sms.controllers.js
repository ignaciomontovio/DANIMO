import { validateSmsSending } from '../utils/validators.js';
import * as service from '../services/sms.service.js';

export const sendMessage = async (req, res) => {
    const { error } = validateSmsSending(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const { to, message } = req.body;
        await service.sendMessage(to, message);
        console.log('✅ SMS enviado con éxito:');
        res.json({ message: 'Sms enviado correctamente' });
    } catch (err) {
        console.error('❌ Error enviando sms:', err);
        return res.status(500).json({ error: 'Error al enviar sms' });
    }
};
