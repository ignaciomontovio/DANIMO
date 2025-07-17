import { suicideRiskDetection } from './riskDetection.js';
import { briefResponse } from './briefResponse.js';
import { containsDateReference } from './containsDateReference.js';
import {clearHistoryReference} from "./clearHistory.js";
import {moodAlternatorDetected} from "./moodAlternatorReference.js";

//agregar http
const CONTAINS_LINKS_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

export function validateMessageIntention(message) {
    const hasSuicideRisk = suicideRiskDetection(message);
    const containsLinks = CONTAINS_LINKS_REGEX.test(message);
    const isBriefResponse = briefResponse(message);
    const hasADateReference = containsDateReference(message);
    const clearHistory = clearHistoryReference(message)

    return { hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory };
}

export const containsLinksResponse = `En Danimo queremos cuidarte, por eso no aceptamos links en el chat. 
Si necesitás compartir algo, contanos con tus palabras y vamos a hacer lo posible para ayudarte. 
¡Gracias por entender y confiar en nosotros!`
