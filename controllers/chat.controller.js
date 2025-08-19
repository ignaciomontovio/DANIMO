import {validateChatInput, validateSummaryForProfessionalInput, validateSummaryInput} from '../utils/validators.js';
import {chat, generateChat} from '../services/chat.service.js';
import {rangedSummmary, weeklySummary, historicalSummary} from "../services/summary.service.js";
import userCache from '../utils/userCache.js';
const HISTORICAL_SUMMARY_CACHE_KEY = 'historicalSummary';
const WEEKLY_SUMMARY_CACHE_KEY = 'weeklySummary';

export const chatController = async (req, res) => {
    const {error, value} = validateChatInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const {message} = req.body;
        const { assistantReply, predominantEmotion, recommendRoutine } = await generateChat({message: message, userId: req.userId});
        console.log(`✅ Mensaje ${value.message} enviado correctamente.`);
        console.log(`✅ Respuesta ${assistantReply} devuelta.`);
        return res.json({
            message: assistantReply,
            predominantEmotion: predominantEmotion,
            recommendRoutine: recommendRoutine
        });
    } catch (err) {
        console.error('❌ Error en /chat dani:', err);
        return res.status(500).json({error: 'Error al crear mensaje'});
    }
}

export const weeklySummaryController = async (req, res) => {
    try {
        const { error, value } = validateSummaryForProfessionalInput(req.body);
        if (error) {
            console.error("❌ Error in joi validation Error:" + error.details[0].message)
            return res.status(400).json({error: error.details[0].message});
        }
        const cacheSummary = userCache.get(value.userId, WEEKLY_SUMMARY_CACHE_KEY);
        if(cacheSummary != null)
            return res.json(cacheSummary);
        const response = await weeklySummary(value.userId)
        userCache.set(value.userId, WEEKLY_SUMMARY_CACHE_KEY, response);
        console.log(`✅ Respuesta ${response.summary} devuelta.`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /summary dani:', err);
        return res.status(500).json({error: `Error al crear resumen semanal ${err.message}`});
    }
}

export const historicalSummaryController = async (req, res) => {
    try {
        const { error, value } = validateSummaryForProfessionalInput(req.body);
        if (error) {
            console.error("❌ Error in joi validation Error:" + error.details[0].message)
            return res.status(400).json({error: error.details[0].message});
        }
        const cacheSummary = userCache.get(value.userId, HISTORICAL_SUMMARY_CACHE_KEY);
        if(cacheSummary != null)
            return res.json(cacheSummary);
        const response = await historicalSummary(value.userId)
        userCache.set(value.userId, HISTORICAL_SUMMARY_CACHE_KEY, response);
        console.log(`✅ Respuesta ${response.summary} devuelta.`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /historicalSummary dani:', err);
        return res.status(500).json({error: `Error al crear resumen historico ${err.message}`});
    }
}

// Nuevo controlador para summary
export const rangedSummaryController = async (req, res) => {
    const { error, value } = validateSummaryInput(req.body);
    if (error) {
        console.error("❌ Error en validación de summary:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const { startDate, endDate } = value;
        const response = await rangedSummmary(value.userId, new Date(startDate), new Date(endDate));
        console.log(`✅ Resumen generado para userId ${req.userId}`);
        console.log(`✅ Respuesta ${response.summary} devuelta.`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /summary:', err);
        // Usar err.statusCode si existe, sino 500
        const status = err.statusCode || 500;
        return res.status(status).json({ error: `Error al crear resumen: ${err.message}` });
    }
};

