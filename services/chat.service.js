import Conversations from '../models/Conversations.js';
import { validateMessageIntention, containsLinksResponse } from './messageIntention/messageIntentionService.js';
import { v4 as generateUUID } from 'uuid';
import { generalPrompt } from '../utils/prompts/generalPrompt.js';
import { suicideRiskDefaultResponse } from '../utils/prompts/suicideRiskPrompt.js';
import {userResponse, suicideRiskResponse, dateEvaluationResponse, beingBriefResponse} from './openai.service.js';
import { format } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

async function evaluateSuicideRisk(message) {
    try{
        return await suicideRiskResponse(message)
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Aquí puedes marcar el mensaje como de riesgo suicida
            return true;
        }
        throw error;
    }
}

function logBriefResponse(message) {
    beingBriefResponse(message)
}

function evaluateDateReference(message) {
    dateEvaluationResponse(message)
}

export async function chat({message, userId}) {
    // Validamos que los parámetros de entrada sean correctos
    if (!message || !userId) {
        throw new Error('El mensaje y el userId son obligatorios');
    }
    try {
        const {hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference} = validateMessageIntention(message);
        console.log(`--- Análisis de Intención del Mensaje ---
        ¿Riesgo de suicidio?         : ${hasSuicideRisk}
        ¿Contiene enlaces?           : ${containsLinks}
        ¿Es una respuesta breve?     : ${isBriefResponse}
        ¿Hace referencia a una fecha?: ${hasADateReference}
        -----------------------------------------
        `);
        switch (true) {
            case hasSuicideRisk === true:
                if (await evaluateSuicideRisk(message) === true)
                    return suicideRiskDefaultResponse
                break
            case containsLinks === true:
                return containsLinksResponse
            case isBriefResponse === true:
                logBriefResponse(message)
                break
            case hasADateReference === true:
                evaluateDateReference(message)
                break
        }
        // Obtén la conversación existente y genera el historial de mensajes
        const messages = await compileConversationHistory(userId, message);
        // Envía el mensaje a la API de OpenAI y obtiene la respuesta
        const assistantReply = await userResponse(messages);
        // Guarda el mensaje del usuario y la respuesta del asistente en la base de datos
        await saveMessagesToDB(userId, message, assistantReply);
        return assistantReply;
    } catch (error) {
        console.error('Error en el flujo del chat:', error.message);
        throw new Error('Ocurrió un problema al procesar la solicitud del chat.');
    }
};

// Función responsable de compilar el historial de conversación
async function compileConversationHistory(userId, currentMessage) {
    const messages = [{role: 'system', content: generalPrompt}];

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
        content: `${currentMessage}. Debes responder con el template de salida. La fecha de hoy es ` + format(new Date(), 'yyyy-MM-dd'),
    });
    return messages;
}

// Función para guardar mensajes en la base de datos
async function saveMessagesToDB(userId, userMessage, assistantReply) {
    const createMessage = async (type, text) => {
        await Conversations.create({
            id: `C-${generateUUID()}`,
            type,
            summaryAvailable: false,
            text,
            messageDate: Date.now(),
            userId,
        });
    };

    await Promise.all([
        createMessage('user', userMessage),
        createMessage('assistant', assistantReply),
    ]);
}