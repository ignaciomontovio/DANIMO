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
    getPredominantEmotion,
    saveRoutineRecommended,
    wasRoutineRecommendedInLast24Hours
} from './messageIntention/routineRecommender.js';
import {crisisRiskDefaultResponse} from "../utils/prompts/suicideRiskPrompt.js";

dotenv.config();

//Variable para definir el riesgo critico (por ahora 6, luego lo pondremos en 7)
const criticalRiskLevel = 6;

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
    const routineRecommended = await wasRoutineRecommendedInLast24Hours(userId, date);
    if (riskScore >= criticalRiskLevel && !routineRecommended) {
        predominantEmotion = await getPredominantEmotion(JSON.parse(evaluation));
        await saveRoutineRecommended(userId, message);
        return { predominantEmotion, recommendRoutine: true };

    }
    return { predominantEmotion, recommendRoutine: false };
}

export async function generateChat({ message, date, ignoreRiskEvaluation, userId }) {
    if (ignoreRiskEvaluation === false && await evaluateRecentSuicideRisk(userId) === true) {
        console.log("El usuario tiene riesgo de suicidio reciente, no se procesará el mensaje.");
        return {assistantReply: crisisRiskDefaultResponse, riskDetected: true};
    }
    return chat({ message, userId, date});
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
        moodAlternatorResponse(message, userId);
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
            return { assistantReply: defaultResponse, predominantEmotion: null, recommendRoutine: false, riskDetected: hasSuicideRisk };
        }
        if (isBriefResponse === true && await briefResponseCooldown(userId, date) === false) {
            console.log("El mensaje es una respuesta breve. Se mandará un disparador de conversacion.");
            saveBriefResponseRegister(userId, message, date);
            prompt = briefResponsePrompt;
        }
        collectInformationAsync(hasADateReference, message, userId, moodAlternator, date);
        const { riskScore, evaluation } = await riskScoreEvaluation(userId, message, date);
        const { predominantEmotion, recommendRoutine } = await handleRoutineRecommendation({
            userId,
            message,
            riskScore,
            evaluation,
            date
        });
        const messages = await compileConversationHistory(userId, message, prompt, date);
        const assistantReply = await userResponse(messages);
        await saveMessagesToDB(userId, message, assistantReply, date);
        return { assistantReply, predominantEmotion, recommendRoutine };
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
