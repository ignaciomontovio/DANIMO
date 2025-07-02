import Conversations from '../models/Conversations.js';
import {validateMessageIntention, containsLinksResponse} from './messageIntention/messageIntentionService.js';
import {v4 as generateUUID} from 'uuid';
import {generalPrompt} from '../utils/prompts/generalPrompt.js';
import {suicideRiskDefaultResponse} from '../utils/prompts/suicideRiskPrompt.js';
import {userResponse, suicideRiskResponse, dateEvaluationResponse, isABriefResponse, stressLevelEvaluationResponse, userIntentMessage} from './openai.service.js';
import dotenv from 'dotenv';
import ImportantEvents from "../models/ImportantEvents.js";
import {briefResponsePrompt} from "../utils/prompts/briefResponsePrompt.js";
import {
    conversacionNoDanimoDefaultResponse,
    intentaBorrarHistorialDefaultResponse
} from "../utils/prompts/userIntentPrompt.js";
import SuicideRiskHandler from './messageEvaluation/SuicideRiskHandler.js';
import ContainsLinksHandler from './messageEvaluation/ContainsLinksHandler.js';
import ClearHistoryHandler from './messageEvaluation/ClearHistoryHandler.js';
import ConversacionNoDanimoHandler from './messageEvaluation/ConversacionNoDanimoHandler.js';
import BriefResponseHandler from './messageEvaluation/BriefResponseHandler.js';
import DateReferenceHandler from './messageEvaluation/DateReferenceHandler.js';
import ImportantDatesNearbyHandler from './messageEvaluation/ImportantDatesNearbyHandler.js';

// Mandar mensaje + cortar conversacion (true-false) + decir que rutina recomendar (id) o que emocion para rutinas
//Pregunta cosas fuera de danimo
dotenv.config();

const context = {
    hasSuicideRisk,
    containsLinks,
    isBriefResponse,
    hasADateReference,
    clearHistory,
    importantDatesNearby,
    message,
    evaluateSuicideRisk,
    suicideRiskDefaultResponse,
    containsLinksResponse,
    intentaBorrarHistorialDefaultResponse,
    userIntentMessage,
    conversacionNoDanimoDefaultResponse,
    briefResponsePrompt,
    setPrompt: (p) => { prompt = p; },
    evaluateDateReference
};
const handlers = [
    new SuicideRiskHandler(context),
    new ContainsLinksHandler(context),
    new ClearHistoryHandler(context),
    new ConversacionNoDanimoHandler(context),
    new BriefResponseHandler(context),
    new DateReferenceHandler(context),
    new ImportantDatesNearbyHandler(context)
];

async function evaluateSuicideRisk(message) {
    return await suicideRiskResponse(message)
}

async function logBriefResponse(message) {
    await isABriefResponse(message)
}

function evaluateDateReference(message) {
    dateEvaluationResponse(message)
}

async function importantDateNearby(userId) {
    const actualMonth = new Date().getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const actualDay = new Date().getDate();
    const importantDates = await ImportantEvents.findAll({
        where: {
            userId
        }
    });
    return importantDates.map(impD => {
        // date1 y date2 son objetos Date
        const date1 = impD.eventDate
        const d1 = new Date(2000, date1.getMonth(), date1.getDate());
        const d2 = new Date(2000, actualMonth, actualDay);
        const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24); // Diferencia en días
        if (diff <= 7) {
            console.log(`¡Atención! La fecha importante "${impD.eventDescription}" está a ${diff} días de distancia.`);
            return true
        } else {
            console.log(`La fecha importante "${impD.eventDescription}" está a más de 7 días de distancia.`);
            return false
        }
    })
}
function emotionWithRiskLevel(emotion) {
    return emotion.ira >= 4 || emotion.tristeza >= 4 || emotion.miedo >= 4
    || emotion.frustracion >= 4 || emotion.culpa >= 4
    || emotion.confusion >= 4 || emotion.euforia >= 4
}
async function stressLevelEvaluation(message) {
    const evaluation = await stressLevelEvaluationResponse(message)
    console.log(`Evaluación de nivel de estrés: ${JSON.stringify(evaluation)}`);
    return {risk: emotionWithRiskLevel(evaluation), evaluation: evaluation};
}

export async function chat({message, userId}) {
    let prompt = generalPrompt;
    // Validamos que los parámetros de entrada sean correctos
    if (!message || !userId) {
        throw new Error('El mensaje y el userId son obligatorios');
    }
    try {
        const importantDatesNearby = await importantDateNearby(userId);
        const {hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory} = await validateMessageIntention(message);
        console.log(`--- Análisis de Intención del Mensaje ---
        ¿Riesgo de suicidio?         : ${hasSuicideRisk}
        ¿Contiene enlaces?           : ${containsLinks}
        ¿Es una respuesta breve?     : ${isBriefResponse}
        ¿Hace referencia a una fecha?: ${hasADateReference}
        ¿Intenta borrar historial?   : ${clearHistory}
        -----------------------------------------
        `);
        
        // Handler base y handlers individuales ahora están en archivos separados
        // Reemplazo del switch/cases por handlers con clases

        for (const handler of handlers) {
            if (handler.matches()) {
                const result = handler.handle.constructor.name === 'AsyncFunction' ? await handler.handle() : handler.handle();
                if (result !== undefined) return result;
                break;
            }
        }
        const {risk, evaluation} = await stressLevelEvaluation(message)
        // Obtén la conversación existente y genera el historial de mensajes
        const messages = await compileConversationHistory(userId, message, prompt);
        // Envía el mensaje a la API de OpenAI y obtiene la respuesta
        const assistantReply = await userResponse(messages);
        // Guarda el mensaje del usuario y la respuesta del asistente en la base de datos
        await saveMessagesToDB(userId, message, assistantReply);
        return assistantReply;
    } catch (error) {
        console.error('Error en el flujo del chat:', error.message);
        throw new Error('Ocurrió un problema al procesar la solicitud del chat.');
    }
}

// Función responsable de compilar el historial de conversación
async function compileConversationHistory(userId, currentMessage, prompt) {
    const messages = [{role: 'system', content: prompt}];

    const conversations = await Conversations.findAll({where: {userId}});
    if (conversations?.length > 0) {
        conversations
            .sort((a, b) => a.messageDate - b.messageDate)
            .forEach(({type, text}) => {
                messages.push({role: type, content: text});
            });
    }
    messages.push({
        role: 'user',
        content: currentMessage
    });
    return messages;
}

// Función para guardar mensajes en la base de datos
async function saveMessagesToDB(userId, userMessage, assistantReply) {
    await Promise.all([
        createMessage('user', userMessage, userId),
        createMessage('assistant', assistantReply, userId),
    ]);
}

const createMessage = async (type, text, userId) => {
    await Conversations.create({
        id: `C-${generateUUID()}`,
        type,
        summaryAvailable: false,
        text,
        messageDate: Date.now(),
        userId,
    });
};