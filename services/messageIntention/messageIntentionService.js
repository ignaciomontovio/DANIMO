import { suicideRiskDetection } from './riskDetection.js';
import { briefResponse } from './briefResponse.js';
import { containsDateReference } from './containsDateReference.js';

const CONTAINS_LINKS_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

export function validateMessageIntention(message) {
    const hasSuicideRisk = suicideRiskDetection(message);
    const containsLinks = CONTAINS_LINKS_REGEX.test(message);
    const isBriefResponse = briefResponse(message);
    const hasADateReference = containsDateReference(message);

    return { hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference };
}

export const containsLinksResponse = 'No se aceptan enlaces en este chat.';
