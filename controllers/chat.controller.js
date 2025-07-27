import { validateChatInput } from '../utils/validators.js';
import { chat, summary } from '../services/chat.service.js';

export const chatController = async (req, res) => {
    const {error, value} = validateChatInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const {message} = req.body;
        const response = await chat({message: message, userId: req.userId});
        console.log(`✅ Mensaje ${value.message} enviado correctamente.`);
        console.log(`✅ Respuesta ${response} devuelta.`);
        res.json({message: response});
    } catch (err) {
        console.error('❌ Error en /chat dani:', err);
        return res.status(500).json({error: 'Error al crear mensaje'});
    }
}

export const weeklySummaryController = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const response = await summary(req.userId, today, sevenDaysAgo)
        console.log(`✅ Respuesta ${response} devuelta.`);
    } catch (err) {
        console.error('❌ Error en /summary dani:', err);
        return res.status(500).json({error: `Error al crear resumen semanal ${err.message}`});
    }
}