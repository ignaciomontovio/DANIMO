import { validateChatInput, validateSummaryInput } from '../utils/validators.js';
import { chat } from '../services/chat.service.js';
import {createSummary, summary, historicalSummary} from "../services/summary.service.js";

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
        const SUMMARY_LENGTH = 100; // Longitud del resumen en palabras
        sevenDaysAgo.setDate(today.getDate() - 7);
        const response = await summary(req.userId, sevenDaysAgo, today, SUMMARY_LENGTH)
        console.log(`✅ Respuesta ${response.summary} devuelta.`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /summary dani:', err);
        return res.status(500).json({error: `Error al crear resumen semanal ${err.message}`});
    }
}

export const historicalSummaryController = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        const HISTORICAL_SUMMARY_LENGTH = 1000; // Longitud del resumen en palabras
        sevenDaysAgo.setDate(today.getDate() - 7);
        const response = await historicalSummary(req.userId, sevenDaysAgo, today, HISTORICAL_SUMMARY_LENGTH)
        console.log(`✅ Respuesta ${response.summary} devuelta.`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /historicalSummary dani:', err);
        return res.status(500).json({error: `Error al crear resumen historico ${err.message}`});
    }
}

// Nuevo controlador para summary
export const summaryController = async (req, res) => {
    const { error, value } = validateSummaryInput(req.body);
    if (error) {
        console.error("❌ Error en validación de summary:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { startDate, endDate } = value;
        const response = await createSummary(req.userId, new Date(startDate), new Date(endDate));
        console.log(`✅ Resumen generado para userId ${req.userId}`);
        res.json(response);
    } catch (err) {
        console.error('❌ Error en /summary:', err);
        return res.status(500).json({ error: `Error al crear resumen: ${err.message}` });
    }
};

