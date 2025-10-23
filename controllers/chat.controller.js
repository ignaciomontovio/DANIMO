import {
    validateChatGenerateInput,
    validateChatInput,
    validateSummaryForProfessionalInput,
    validateSummaryInput, validateUserId
} from '../utils/validators.js';
import {generateChat} from '../services/chat.service.js';
import {rangedSummmary, weeklySummary, historicalSummary, availableYears} from "../services/summary.service.js";
import userCache from '../utils/userCache.js';
import Users from "../models/Users.js";

const HISTORICAL_SUMMARY_CACHE_KEY = 'historicalSummary';
const WEEKLY_SUMMARY_CACHE_KEY = 'weeklySummary';
const RANGED_SUMMARY_CACHE_KEY = 'rangedSummary';

export const chatGenerateController = async (req, res) => {
    const {error, value} = validateChatGenerateInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const {message, date} = req.body;
        const userFound = await Users.findOne({where: {email: value.email}})
        if (!userFound) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        const {
            assistantReply: assistantReply,
            predominantEmotion: predominantEmotion,
            recommendRoutine: recommendRoutine,
            warningConversationLimit: warningConversationLimit,
            reachedConversationLimit: reachedConversationLimit,
            riskDetected: riskDetected,
            contactProfessional: contactProfessional
        } = await generateChat({message: message, date: new Date(date), ignoreRiskEvaluation: true, userId: userFound.id});
        console.log(`✅ Mensaje ${value.message} enviado correctamente.`);
        console.log(`✅ Respuesta ${assistantReply} devuelta.`);
        console.log(`✅ Emoción predominante: ${predominantEmotion}`);
        console.log(`✅ Rutina recomendada: ${recommendRoutine}`);
        console.log(`✅ Límite de conversaciones advertido: ${warningConversationLimit}`);
        console.log(`✅ Límite de conversaciones alcanzado: ${reachedConversationLimit}`);
        console.log(`✅ Riesgo detectado: ${riskDetected}`);
        console.log(`✅ Contactar profesional: ${contactProfessional}`);
        return res.json({
            message: assistantReply,
            predominantEmotion: predominantEmotion,
            recommendRoutine: recommendRoutine,
            warningConversationLimit: warningConversationLimit,
            reachedConversationLimit: reachedConversationLimit,
            riskDetected: riskDetected,
            contactProfessional: contactProfessional
        });
    } catch (err) {
        console.error('❌ Error en /chat dani:', err);
        return res.status(500).json({error: 'Error al crear mensaje'});
    }
}

export const chatController = async (req, res) => {
    const {error, value} = validateChatInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const {message} = req.body;
        const {
            assistantReply: assistantReply,
            predominantEmotion: predominantEmotion,
            recommendRoutine: recommendRoutine,
            warningConversationLimit: warningConversationLimit,
            reachedConversationLimit: reachedConversationLimit,
            riskDetected: riskDetected,
            contactProfessional: contactProfessional
        } = await generateChat({message: message, date: new Date(Date.now()), ignoreRiskEvaluation: false, userId: req.userId});
        console.log(`✅ Mensaje ${value.message} enviado correctamente.`);
        console.log(`✅ Respuesta ${assistantReply} devuelta.`);
        console.log(`✅ Emoción predominante: ${predominantEmotion}`);
        console.log(`✅ Rutina recomendada: ${recommendRoutine}`);
        console.log(`✅ Límite de conversaciones advertido: ${warningConversationLimit}`);
        console.log(`✅ Límite de conversaciones alcanzado: ${reachedConversationLimit}`);
        console.log(`✅ Riesgo detectado: ${riskDetected}`);
        console.log(`✅ Contactar profesional: ${contactProfessional}`);
        return res.json({
            message: assistantReply,
            predominantEmotion: predominantEmotion,
            recommendRoutine: recommendRoutine,
            riskDetected: riskDetected,
            warningConversationLimit: warningConversationLimit,
            reachedConversationLimit: reachedConversationLimit,
            contactProfessional: contactProfessional
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
        if(value.refreshCache === true) {
            userCache.delete(value.userId, WEEKLY_SUMMARY_CACHE_KEY)
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
        if(value.refreshCache === true) {
            userCache.delete(value.userId, HISTORICAL_SUMMARY_CACHE_KEY)
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
        const INPUT_CACHE_KEY = `${value.userId} ${startDate} ${endDate}`
        if(value.refreshCache === true) {
            userCache.delete(INPUT_CACHE_KEY, RANGED_SUMMARY_CACHE_KEY)
        }
        const cacheSummary = userCache.get(INPUT_CACHE_KEY, RANGED_SUMMARY_CACHE_KEY);
        if(cacheSummary != null)
            return res.json(cacheSummary);
        const response = await rangedSummmary(value.userId, new Date(startDate), new Date(endDate), value.size);
        userCache.set( INPUT_CACHE_KEY, RANGED_SUMMARY_CACHE_KEY, response);
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

export const summaryAvailableYears = async (req, res) => {
    const {error, value} = validateUserId(req.body)
    if (error) {
        console.error("❌ Error obteniendo años disponibles:", error.details[0].message);
        return res.status(400).json({error: error.details[0].message});
    }
    await availableYears(value.userId).then(years => {
        console.log(`✅ Años disponibles para userId ${value.userId}: ${years}`);
        const currentYear = new Date().getFullYear();
        if (!years.includes(currentYear)) {
            years.push(currentYear);
        }
        return res.json({availableYears: years});
    }).catch(err => {
        console.error('❌ Error obteniendo años disponibles:', err);
        return res.status(500).json({error: 'Error al obtener años disponibles'});
    });
}

