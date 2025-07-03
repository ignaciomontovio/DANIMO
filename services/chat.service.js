import Conversations from '../models/Conversations.js';
import {validateMessageIntention} from './messageIntention/messageIntentionService.js';
import {v4 as generateUUID} from 'uuid';
import {generalPrompt} from '../utils/prompts/generalPrompt.js';
import {userResponse, dateEvaluationResponse} from './openai.service.js';
import dotenv from 'dotenv';
import {briefResponsePrompt} from "../utils/prompts/briefResponsePrompt.js";
import {riskScoreEvaluation} from "./messageIntention/riskScoreEvaluation.js";
import {conditionChecker} from "./messageIntention/autoResponseConditionChecker.js";

dotenv.config();

function evaluateDateReference(message) {
    dateEvaluationResponse(message)
}

export async function chat({message, userId}) {
    let prompt = generalPrompt;
    // Validamos que los parámetros de entrada sean correctos
    if (!message || !userId) {
        throw new Error('El mensaje y el userId son obligatorios');
    }
    try {
        const {hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory} = await validateMessageIntention(message);
        const {autoResponse, defaultResponse} =
            await conditionChecker(message, hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory)
        if(autoResponse === true) {
            return defaultResponse
        }
        if(isBriefResponse === true) {
            console.log("El mensaje es una respuesta breve");
            prompt = briefResponsePrompt;
        }
        if (hasADateReference === true) {
            console.log("El mensaje contiene una referencia a una fecha");
            evaluateDateReference(message);
        }
        await riskScoreEvaluation(userId, message)
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
    console.log(`Se guardara ${userId} `)
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