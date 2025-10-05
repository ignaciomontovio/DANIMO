import Conversations from '../models/Conversations.js';
import {validateMessageIntention} from './messageIntention/messageIntentionService.js';
import {v4 as generateUUID} from 'uuid';
import {generalPrompt} from '../utils/prompts/generalPrompt.js';
import {dateEvaluationResponse, moodAlternatorResponse, userResponse} from './openai.service.js';
import dotenv from 'dotenv';
import {briefResponsePastTopicRevivalPrompt, briefResponsePrompt} from "../utils/prompts/briefResponsePrompt.js";
import {riskScoreEvaluation} from "./messageIntention/riskScoreEvaluation.js";
import {
    autoResponseConditionChecker,
    evaluateConversationDailyLimit,
    evaluateRecentSuicideRisk
} from "./messageIntention/autoResponseConditionChecker.js";
import {briefResponseCooldown, saveBriefResponseRegister} from "./messageIntention/briefResponse.js";
import {
    getPredominantEmotion,
    saveRoutineRecommended,
    wasRoutineRecommendedInLast24Hours,
    countRoutinesRecommendedToday
} from './messageIntention/routineRecommender.js';
import {crisisRiskDefaultResponse} from "../utils/prompts/suicideRiskPrompt.js";
import Users from "../models/Users.js";
import Professionals from "../models/Professionals.js";
dotenv.config();

//Variable para definir el riesgo critico 
const CRITICAL_RISK_LEVEL = 5;
//Variable para definir el maximo de rutinas que se recomiendan por día
const MAX_ROUTINES_RECOMENDED = 4;

// Función auxiliar para manejar respuestas automáticas y prompts
async function handleAutoResponses({ message, userId, date }) {
    const {
        hasSuicideRisk,
        containsLinks,
        isBriefResponse,
        hasADateReference,
        clearHistory,
        moodAlternator
    } = validateMessageIntention(message);
    const { autoResponse, defaultResponse } = await autoResponseConditionChecker(
        message,
        userId,
        hasSuicideRisk,
        containsLinks,
        isBriefResponse,
        hasADateReference,
        clearHistory,
        moodAlternator,
        date
    );
    return {
        autoResponse,
        defaultResponse,
        hasSuicideRisk,
        isBriefResponse,
        hasADateReference,
        moodAlternator
    };
}

// Función auxiliar para manejar lógica de rutina recomendada
async function handleRoutineRecommendation({ userId, message, riskScore, evaluation, date }) {
    let predominantEmotion = null;

    const routinesToday = await countRoutinesRecommendedToday(userId, date);

    if (riskScore >= CRITICAL_RISK_LEVEL && routinesToday < MAX_ROUTINES_RECOMENDED) {
        predominantEmotion = await getPredominantEmotion(JSON.parse(evaluation));
        await saveRoutineRecommended(userId, message);

        const isFourth = routinesToday + 1 === MAX_ROUTINES_RECOMENDED;

        let contactProfessional = "no";
        if (isFourth) {
            // Traer el usuario con sus profesionales asociados
            const user = await Users.findByPk(userId, {
                include: [{ model: Professionals, as: "Professionals" }]
            });

            if (user && user.Professionals.length > 0) {
                // Tomo el primero (o podrías recorrerlos)
                contactProfessional = user.Professionals[0].email;
            } else {
                contactProfessional = "recomendar";
            }
        }

        return { 
            predominantEmotion, 
            recommendRoutine: true, 
            contactProfessional 
        };
    }

    return { 
        predominantEmotion, 
        recommendRoutine: false, 
        contactProfessional: "no" 
    };
}

export async function generateChat({ message, date, ignoreRiskEvaluation, userId }) {
    let warningConversationLimit = false;
    if (ignoreRiskEvaluation === false && await evaluateRecentSuicideRisk(userId) === true) {
        console.log("El usuario tiene riesgo de suicidio reciente, no se procesará el mensaje.");
        return {assistantReply: crisisRiskDefaultResponse, riskDetected: true};
    }
    const {warningLimit, reachedLimit} = await evaluateConversationDailyLimit(userId)
    if (ignoreRiskEvaluation === false && warningLimit === true) {
        console.log("El usuario está cerca de alcanzar el límite diario de mensajes.");
        warningConversationLimit = true
    }
    if (ignoreRiskEvaluation === false && reachedLimit === true) {
        console.log("El usuario ha alcanzado el límite diario de mensajes, no se procesará el mensaje.");
        return {
            assistantReply:
                `Has interactuado mucho hoy con Dani. 
                Para cuidar tu bienestar, el chat estará disponible nuevamente mañana. 
                Mientras tanto, podés tomarte un descanso, respirar profundo o realizar alguna actividad que te ayude a relajarte. 
                Estamos aquí para vos cuando regreses.`,
            reachedConversationLimit: true
        };
    }

    const chatResponse = await chat({message: message, userId: userId, date: date})
    chatResponse.warningConversationLimit = warningConversationLimit
    return chatResponse
}

function collectInformationAsync(hasADateReference, message, userId, moodAlternator, date) {
    if (hasADateReference === true) {
        console.log("El mensaje contiene una referencia a una fecha");
        //Validamos de forma asincrona si el mensaje contiene una fecha importante y la guardamos
        dateEvaluationResponse(message, userId, date);
    }
    if (moodAlternator === true) {
        console.log("El mensaje hace referencia a alteradores de animo");
        //Validamos de forma asincrona si el mensaje contiene un alterador de animo y la guardamos
        moodAlternatorResponse(message, userId, date);
    }
}

export async function chat({ message, userId, date}) {
    let prompt = generalPrompt;
    try {
        const {
            autoResponse,
            defaultResponse,
            hasSuicideRisk,
            isBriefResponse,
            hasADateReference,
            moodAlternator
        } = await handleAutoResponses({ message, userId, date });
        if (autoResponse === true) {
            return { assistantReply: defaultResponse, predominantEmotion: null, recommendRoutine: false, riskDetected: hasSuicideRisk, contactProfessional: false };
        }
        if (isBriefResponse === true && await briefResponseCooldown(userId, date) === false) {
            console.log("El mensaje es una respuesta breve. Se mandará un disparador de conversacion.");
            saveBriefResponseRegister(userId, message, date);
            if( Math.random() < 0.5 ){
                prompt = briefResponsePrompt;
            } else {
                prompt = briefResponsePastTopicRevivalPrompt;
            }
        }
        collectInformationAsync(hasADateReference, message, userId, moodAlternator, date);
        const { riskScore, evaluation } = await riskScoreEvaluation(userId, message, date);
        const { predominantEmotion, recommendRoutine, contactProfessional } = await handleRoutineRecommendation({
            userId,
            message,
            riskScore,
            evaluation,
            date
        });
        const messages = await compileConversationHistory(userId, message, prompt, date);
        const assistantReply = await userResponse(messages);
        await saveMessagesToDB(userId, message, assistantReply, date);
        return { assistantReply, predominantEmotion, recommendRoutine, contactProfessional };
    } catch (error) {
        console.error('Error en el flujo del chat:', error.message);
        throw new Error('Ocurrió un problema al procesar la solicitud del chat.');
    }
}

// Función responsable de compilar el historial de conversación
async function compileConversationHistory(userId, currentMessage, prompt, date) {
    const messages = [{role: 'system', content: prompt}];

    const conversations = await Conversations.findAll({where: {userId}});
    if (conversations?.length > 0) {
        conversations
            .filter(conversation => conversation.messageDate < date)
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
async function saveMessagesToDB(userId, userMessage, assistantReply, date) {
    await Promise.all([
        createMessage('user', userMessage, userId, date),
        createMessage('assistant', assistantReply, userId, new Date(date.getTime() + 1000)),
    ]);
}

const createMessage = async (type, text, userId, date) => {
    await Conversations.create({
        id: `C-${generateUUID()}`,
        type,
        summaryAvailable: false,
        text,
        messageDate: date,
        userId,
    });
};
