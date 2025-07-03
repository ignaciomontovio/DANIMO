import {userResponse, suicideRiskResponse, dateEvaluationResponse, isABriefResponse, stressLevelEvaluationResponse, userIntentMessage} from './openai.service.js';
import {suicideRiskDefaultResponse} from "../../utils/prompts/suicideRiskPrompt.js";
import {containsLinksResponse} from "./messageIntentionService.js";
import {conversacionNoDanimoDefaultResponse} from "../../utils/prompts/userIntentPrompt.js";


export async function conditionChecker( hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory ) {
    if (hasSuicideRisk) {
        if(await suicideRiskResponse(message) === true)
            console.log("Confirmado riesgo de suicidio tras evaluación")
            return { autoResponse: true, defaultResponse: suicideRiskDefaultResponse };
    }

    if(containsLinks === true) {
        console.log("El mensaje contiene enlaces");
        return { autoResponse: true, defaultResponse: containsLinksResponse };
    }

    if(clearHistory === true) {
        console.log("El usuario intenta borrar el historial de conversaciones");
        return { autoResponse: true, defaultResponse: intentaBorrarHistorialDefaultResponse };
    }

    const { conversacionNoDanimo, intentaBorrarHistorial } = await userIntentMessage(message);
    if(conversacionNoDanimo === true) {
        console.log("El usuario habló de un tema no relacionado con el ánimo");
        return { autoResponse: true, defaultResponse: conversacionNoDanimoDefaultResponse };
    }

}