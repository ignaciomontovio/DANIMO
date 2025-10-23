import {suicideRiskResponse, userIntentMessage} from '../openai.service.js';
import {crisisRiskDefaultResponse} from "../../utils/prompts/suicideRiskPrompt.js";
import {containsLinksResponse} from "./messageIntentionService.js";
import {conversacionNoDanimoDefaultResponse} from "../../utils/prompts/userIntentPrompt.js";
import {intentaBorrarHistorialDefaultResponse} from "../../utils/prompts/userIntentPrompt.js";
import UsersEmotionalState from "../../models/UsersEmotionalState.js";
import {v4 as uuidv4} from "uuid";
import Conversations from "../../models/Conversations.js";
import {Op} from "sequelize";
const MILLISECONDS_IN_A_HOUR = 60 * 60 * 1000
const WARNING_LIMIT = 50
const REACHED_LIMIT = 1000

function logFlags(hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator) {
    console.log(`--- Análisis de Intención del Mensaje ---
        ¿Riesgo de suicidio?         : ${hasSuicideRisk}
        ¿Contiene enlaces?           : ${containsLinks}
        ¿Es una respuesta breve?     : ${isBriefResponse}
        ¿Hace referencia a una fecha?: ${hasADateReference}
        ¿Intenta borrar historial?   : ${clearHistory}
        ¿Hay alteradores de animo?   : ${moodAlternator}
        -----------------------------------------
        `);
}

export async function autoResponseConditionChecker(message, userId, hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator, date) {
    logFlags(hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator);
    if (hasSuicideRisk) {
        if (await suicideRiskResponse(message) === true){
            console.log("Confirmado riesgo de suicidio tras evaluación")
            UsersEmotionalState.create(
                {
                    id: `RISK-${uuidv4()}`,
                    briefResponseDetected: false,
                    routineRecomended: false,
                    suicideRiskDetected: true,
                    message: message,
                    date: date,
                    userId: userId
                }
            )
            return {autoResponse: true, defaultResponse: crisisRiskDefaultResponse};
        }
    }

    if (containsLinks === true) {
        console.log("El mensaje contiene enlaces");
        return {autoResponse: true, defaultResponse: containsLinksResponse};
    }

    if (clearHistory === true) {
        console.log("El usuario intenta borrar el historial de conversaciones");
        return {autoResponse: true, defaultResponse: intentaBorrarHistorialDefaultResponse};
    }

    const {conversacionNoDanimo, intentaBorrarHistorial} = await userIntentMessage(message);
    if (intentaBorrarHistorial === true) {
        console.log("El usuario intenta borrar el historial de conversaciones");
        return {autoResponse: true, defaultResponse: intentaBorrarHistorialDefaultResponse};
    }
    if (conversacionNoDanimo === true) {
        console.log("El usuario habló de un tema no relacionado con el ánimo");
        return {autoResponse: true, defaultResponse: conversacionNoDanimoDefaultResponse};
    }
    return {autoResponse: false, defaultResponse: null};
}

export async function evaluateRecentSuicideRisk(userId) {
    const userStates = await UsersEmotionalState.findAll({
        where: { userId, suicideRiskDetected: true },
        order: [['date', 'DESC']],
        limit: 1
    });
    if(userStates.length === 0) {
        return false;
    }
    const lastRiskState = userStates[0];
    //Devuelvo true si pasaron menos de 24 horas desde el último estado de riesgo
    return (new Date() - lastRiskState.date) / MILLISECONDS_IN_A_HOUR < 24;
}

export async function evaluateConversationDailyLimit(userId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * MILLISECONDS_IN_A_HOUR);
    const messageCount = await Conversations.findAll({
        where: {
            userId,
            messageDate: {
                [Op.gte]: twentyFourHoursAgo
            }
        },
        attributes: ['id']
    }).then(messages => messages.length)
    const warningLimit = WARNING_LIMIT < messageCount && messageCount <= REACHED_LIMIT;
    const reachedLimit = REACHED_LIMIT <= messageCount;
    return {warningLimit, reachedLimit};
}