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

dotenv.config();

//Variable para definir el riesgo critico (por ahora 6, luego lo pondremos en 7)
const criticalRiskLevel = 6;

// Función auxiliar para manejar respuestas automáticas y prompts
async function handleAutoResponses({ message, userId }) {
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
        moodAlternator
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
async function handleRoutineRecommendation({ userId, message, riskScore, evaluation }) {
    let predominantEmotion = null;
    let recommendRoutine = false;
    const routineRecommended = await wasRoutineRecommendedInLast24Hours(userId);
    if (riskScore >= criticalRiskLevel && !routineRecommended) {
        predominantEmotion = await getPredominantEmotion(JSON.parse(evaluation));
        recommendRoutine = true;
        await saveRoutineRecommended(userId, message);
    }
    return { predominantEmotion, recommendRoutine };
}

export async function generateChat({ message, userId }) {
    if (await evaluateRecentSuicideRisk(userId) === true) {
        console.log("El usuario tiene riesgo de suicidio reciente, no se procesará el mensaje.");
        return {assistantReply: "No podemos procesar tu mensaje en este momento. Por favor, contacta a un profesional de salud mental.", riskDetected: true};
    }
    return chat({ message, userId });
}

function collectInformationAsync(hasADateReference, message, userId, moodAlternator) {
    if (hasADateReference === true) {
        console.log("El mensaje contiene una referencia a una fecha");
        //Validamos de forma asincrona si el mensaje contiene una fecha importante y la guardamos
        dateEvaluationResponse(message, userId);
    }
    if (moodAlternator === true) {
        console.log("El mensaje hace referencia a alteradores de animo");
        //Validamos de forma asincrona si el mensaje contiene un alterador de animo y la guardamos
        moodAlternatorResponse(message, userId);
    }
}

export async function chat({ message, userId }) {
    let prompt = generalPrompt;
    try {
        const {
            autoResponse,
            defaultResponse,
            hasSuicideRisk,
            isBriefResponse,
            hasADateReference,
            moodAlternator
        } = await handleAutoResponses({ message, userId });
        if (autoResponse === true) {
            return { assistantReply: defaultResponse, predominantEmotion: null, recommendRoutine: false, riskDetected: hasSuicideRisk };
        }
        if (isBriefResponse === true && await briefResponseCooldown(userId) === false) {
            console.log("El mensaje es una respuesta breve");
            saveBriefResponseRegister(userId, message);
            prompt = briefResponsePrompt;
        }
        collectInformationAsync(hasADateReference, message, userId, moodAlternator);
        const { riskScore, evaluation } = await riskScoreEvaluation(userId, message);
        const { predominantEmotion, recommendRoutine } = await handleRoutineRecommendation({
            userId,
            message,
            riskScore,
            evaluation
        });
        const messages = await compileConversationHistory(userId, message, prompt);
        const assistantReply = await userResponse(messages);
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
