import {
    validateDaniImportantDateResponse,
    validateDaniSuicideRiskResponse,
    validateStressLevelResponse, validateUserIntentResponse,
    validateDaniMoodAlternatorResponse
} from "../utils/validators.js";
import {suicideRiskPrompt} from "../utils/prompts/suicideRiskPrompt.js";
import {importantDatePrompt, importantDatePromptFiltrado} from "../utils/prompts/importantDatePrompt.js";
import {stressLevelEvaluationPrompt} from "../utils/prompts/stressLevelEvaluationPrompt.js";
import {moodAlternatorPrompt} from "../utils/prompts/moodAlternatorPrompt.js";
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import {format} from "date-fns";
import {userIntentPrompt} from "../utils/prompts/userIntentPrompt.js";

//const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
//const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const AZURE_OPENAI_API_GPT3_URL = process.env.AZURE_OPENAI_API_GPT3_URL
const AZURE_OPENAI_API_GPT4_URL = process.env.AZURE_OPENAI_API_GPT4_URL
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY

export async function sendMessageToAzureOpenIA(messages, model = AZURE_OPENAI_API_GPT3_URL) {
    const headers = {
        Authorization: `Bearer ${AZURE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    };

    const response = await axios.post(model, {
        messages,
    }, {headers});

    console.log("Enviando mensaje a Azure OpenAI con el modelo: " + model);
    const replyContent = response.data.choices[0]?.message?.content;
    if (!replyContent) {
        throw new Error('La API de OpenAI no retornó una respuesta válida.');
    }
    return replyContent
}

export async function sendMessageToAzureOpenIAWithParseJson(messages, model = AZURE_OPENAI_API_GPT3_URL) {
    const replyContent = await sendMessageToAzureOpenIA(messages, model)
    const parsedReply = JSON.parse(replyContent);
    //console.log(parsedReply);
    return parsedReply;
}

// Función para enviar mensajes a la API de OpenAI
export async function userResponse(messages, prompt = AZURE_OPENAI_API_GPT4_URL) {
    try {
        const reply = await sendMessageToAzureOpenIA(messages, prompt);

        return reply;
    } catch (error) {
        console.error('Error al comunicarse con la API de OpenAI:', error.response?.data || error.message);
        throw new Error('Fallo al comunicarse con la API de OpenAI.');
    }
}

export async function suicideRiskResponse(message) {
    try {
        const messages = [
            {role: 'system', content: suicideRiskPrompt},
            {role: 'user', content: message}];

        const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
        console.log("Respuesta de la API de OpenAI: " + reply);
        const {error, value} = validateDaniSuicideRiskResponse(reply);

        if (error) {
            throw new Error(`Respuesta inválida en suicideRiskResponse: ${error.details[0].message}`);
        }
        return value.suicideRiskDetected === true
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Aquí puedes marcar el mensaje como de riesgo suicida
            return true;
        }
        throw error;
    }
}

export async function dateEvaluationResponse(message,userId) {
    const messages = [
        {role: 'system', content: importantDatePromptFiltrado},
        {role: 'user', content: message + ". La fecha de hoy es " + format(new Date(), 'yyyy-MM-dd')}];
    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    const {error, value} = validateDaniImportantDateResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida en dateEvaluationResponse: ${error.details[0].message}`);
    }
    if (value.esSignificativo === true && value.categoriaFechaImportante !== 'ninguna') {
        console.log("Fecha importante detectada: " + value.fechaImportante);
        await ImportantEvents.create({
            id: "FI-" + uuidv4(),
            eventDescription: value.descripcionFechaImportante,
            eventType: value.categoriaFechaImportante,
            eventDate: value.fechaImportante,
            userId: userId
        })
    }
    return value.esSignificativo
}

export async function stressLevelEvaluationResponse(message) {
    const messages = [
        {role: 'system', content: stressLevelEvaluationPrompt},
        {role: 'user', content: message}];
    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    const { error, value } = validateStressLevelResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida en stressLevelEvaluation: ${error.details[0].message}`);
    }
    return reply
}

export async function userIntentMessage(message) {
    const messages = [
        {role: 'system', content: userIntentPrompt},
        {role: 'user', content: message}];

    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    const { error, value } = validateUserIntentResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida en userIntentMessge: ${error.details[0].message}`);
    }
    console.log("Respuesta de userIntentMessage: conversacionNoDanimo " + reply.conversacionNoDanimo + " intentaBorrarHistorial " + reply.intentaBorrarHistorial);
    return {conversacionNoDanimo: reply.conversacionNoDanimo, intentaBorrarHistorial: reply.intentaBorrarHistorial}
}

export async function moodAlternatorResponse(message,userId) {
    const messages = [
        {role: 'system', content: moodAlternatorPrompt},
        {role: 'user', content: message}];
    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    const {error, value} = validateDaniMoodAlternatorResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida en moodAlternatorResponse: ${error.details[0].message}`);
    }
    if (value.esSignificativo === true && value.categoriaAlteradorAnimo !== 'ninguna') {
        console.log("Alterador de animo detectado para categoria: " + value.categoriaAlteradorAnimo);
        //Hay que insertar el alterador en la tabla
        await MoodAlternators.create({
            id: "MA-" + uuidv4(),
            description: value.descripcionAlteradorAnimo,
            category: value.categoriaAlteradorAnimo,
            userId: userId
        })
        
    }
    return value.esSignificativo
}

// Función para enviar mensajes a la API de OpenAI por fuera de azure (comentada porque no se usa actualmente)
/*
export async function sendMessageToOpenIA(messages) {
    const headers = {
        Authorization: `Bearer ${CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
    };

    const response = await axios.post(OPENAI_API_URL, {
        model: 'gpt-3.5-turbo', //gpt-3.5-turbo | gpt-3.5-turbo-16k | gpt-4 | gpt-4-32k | gpt-4-32k | gpt-4-0125-preview
        messages,
    }, {headers});

    const replyContent = response.data.choices[0]?.message?.content;
    if (!replyContent) {
        throw new Error('La API de OpenAI no retornó una respuesta válida.');
    }
    const parsedReply = JSON.parse(replyContent);
    console.log(parsedReply);
    return parsedReply;
}
*/