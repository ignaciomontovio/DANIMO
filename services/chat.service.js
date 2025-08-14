import Conversations from '../models/Conversations.js';
import {validateMessageIntention} from './messageIntention/messageIntentionService.js';
import {v4 as generateUUID} from 'uuid';
import {generalPrompt} from '../utils/prompts/generalPrompt.js';
import {dateEvaluationResponse, moodAlternatorResponse, userResponse} from './openai.service.js';
import dotenv from 'dotenv';
import {briefResponsePrompt} from "../utils/prompts/briefResponsePrompt.js";
import {riskScoreEvaluation} from "./messageIntention/riskScoreEvaluation.js";
import {
    autoResponseConditionChecker,
    evaluateRecentSuicideRisk
} from "./messageIntention/autoResponseConditionChecker.js";
import {briefResponseCooldown, saveBriefResponseRegister} from "./messageIntention/briefResponse.js";
import {
    getRecommendedRoutineName,
    getPredominantEmotion,
    saveRoutineRecommended,
    wasRoutineRecommendedInLast24Hours
} from './messageIntention/routineRecommender.js';
import {routineRecomendedMessage} from "../utils/routineResponse.js";

dotenv.config();

//Variable para definir el riesgo critico (por ahora 6, luego lo pondremos en 7)
const criticalRiskLevel = 6;

function evaluateDateReference(message,userId) {
    dateEvaluationResponse(message,userId)
}

function evaluateMoodAlternator(message,userId){
    moodAlternatorResponse(message,userId)
}

export async function chat({message, userId}) {
    if (await evaluateRecentSuicideRisk(userId) === true) {
        console.log("El usuario tiene riesgo de suicidio reciente, no se procesará el mensaje.")
        return "No podemos procesar tu mensaje en este momento. Por favor, contacta a un profesional de salud mental.";
    }
    let prompt = generalPrompt;
    // Validamos que los parámetros de entrada sean correctos
    if (!message || !userId) {
        throw new Error('El mensaje y el userId son obligatorios');
    }
    try {
        const {hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator} =
            validateMessageIntention(message);
        const {autoResponse, defaultResponse} =
            await autoResponseConditionChecker(message, userId, hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference, clearHistory, moodAlternator)
        //console.log("Respuesta obtenida: "+defaultResponse);            
        if (autoResponse === true) {
            return { assistantReply: defaultResponse, predominantEmotion:null, recommendRoutine:false };
        }
        if (isBriefResponse === true && await briefResponseCooldown(userId) === false) {
            console.log("El mensaje es una respuesta breve");
            saveBriefResponseRegister(userId, message)
            prompt = briefResponsePrompt;
        }
        if (hasADateReference === true) {
            console.log("El mensaje contiene una referencia a una fecha");
            evaluateDateReference(message,userId);
        }
        if (moodAlternator === true){
            console.log("El mensaje hace referencia a alteradores de animo");
            evaluateMoodAlternator(message,userId);
        }
        //Puntaje de riesgo y emociones evaluadas
        const {riskScore, evaluation} = await riskScoreEvaluation(userId, message)
        //console.log('Puntaje de riesgo calculado: ' + riskScore)
        //console.log('Evaluacion obtenida: ' + evaluation)
        //console.log('Emocion predominante evaluada: ' + getPredominantEmotion(JSON.parse(evaluation)))

          // Variables solicitadas
        let predominantEmotion = null;
        let recommendRoutine = false;

        //Me fijo si le recomendé una rutina hace menos de 24 horas
        const routineRecommended = await wasRoutineRecommendedInLast24Hours(userId);

        // Si el riesgo supera el critico y no le recomendé una rutina en las ultimas 24 horas
        if (riskScore >= criticalRiskLevel && !routineRecommended) {
            //obtengo la emocion predominante
            predominantEmotion = await getPredominantEmotion(JSON.parse(evaluation));
            //pongo en true el flag para recomendar una rutina
            recommendRoutine = true;
            //guardo en la base que le recomiendo una rutina
            await saveRoutineRecommended(userId, message);
        }

        const messages = await compileConversationHistory(userId, message, prompt);
            // Envía el mensaje a la API de OpenAI y obtiene la respuesta
        const assistantReply = await userResponse(messages);
            // Guarda el mensaje del usuario y la respuesta del asistente en la base de datos
        await saveMessagesToDB(userId, message, assistantReply);
        return { assistantReply, predominantEmotion, recommendRoutine };        
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

