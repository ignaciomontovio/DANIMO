import {suicideRiskResponse, userIntentMessage} from '../openai.service.js';
import {suicideRiskDefaultResponse} from "../../utils/prompts/suicideRiskPrompt.js";
import {containsLinksResponse} from "./messageIntentionService.js";
import {conversacionNoDanimoDefaultResponse} from "../../utils/prompts/userIntentPrompt.js";
import {intentaBorrarHistorialDefaultResponse} from "../../utils/prompts/userIntentPrompt.js";
import UsersEmotionalState from "../../models/UsersEmotionalState.js";
import {v4 as uuidv4} from "uuid";

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

export async function autoResponseConditionChecker(message, userId, hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator) {
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
                    date: new Date(),
                    userId: userId
                }
            )
            return {autoResponse: true, defaultResponse: suicideRiskDefaultResponse};
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
    if (conversacionNoDanimo === true) {
        console.log("El usuario habló de un tema no relacionado con el ánimo");
        return {autoResponse: true, defaultResponse: conversacionNoDanimoDefaultResponse};
    }
    return {autoResponse: false, defaultResponse: null};
}

export async function evaluateRecentSuicideRisk(userId) {
    const today = new Date()
    const [day, month, year] = [today.getDay(), today.getMonth(), today.getFullYear()];
    const userStates = await UsersEmotionalState.findAll({ where: { userId } });
    console.log(userStates)
    if(userStates.some(state => state.suicideRiskDetected === true
        && state.date.getDay() === day && state.date.getMonth() === month && state.date.getFullYear() === year)) {
        console.log("El usuario ha tenido riesgo de suicidio hoy. Se bloqueará el envío de mensajes.");
        return true;
    }
}