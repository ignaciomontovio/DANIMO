import {validateDaniImportantDateResponse, validateDaniSuicideRiskResponse} from "../utils/validators.js";
import {suicideRiskPrompt} from "../utils/prompts/suicideRiskPrompt.js";
import {importantDatePrompt} from "../utils/prompts/importantDatePrompt.js";
import {briefResponsePrompt} from "../utils/prompts/briefResponsePrompt.js";
import ImportantEvents from "../models/ImportantEvents.js";
import axios from "axios";
import {validateDaniResponse} from "../utils/validators.js";
import {v4 as uuidv4} from 'uuid';
import {format} from "date-fns";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const AZURE_OPENAI_API_GPT3_URL = process.env.AZURE_OPENAI_API_GPT3_URL
const AZURE_OPENAI_API_GPT4_URL = process.env.AZURE_OPENAI_API_GPT4_URL
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY

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
    console.log(parsedReply);
    return parsedReply;
}

// Función para enviar mensajes a la API de OpenAI
export async function userResponse(messages) {
    try {
        const reply = await sendMessageToAzureOpenIA(messages);

        /*const { error } = validateDaniResponse(reply);

        if (error) {
            throw new Error(`Respuesta inválida: ${error.details[0].message}`);
        }*/

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
            throw new Error(`Respuesta inválida: ${error.details[0].message}`);
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

export async function dateEvaluationResponse(message) {
    const messages = [
        {role: 'system', content: importantDatePrompt},
        {role: 'user', content: message + ". La fecha de hoy es " + format(new Date(), 'yyyy-MM-dd')}];
    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    const {error, value} = validateDaniImportantDateResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida: ${error.details[0].message}`);
    }
    if (value.esSignificativo === true && value.categoriaFechaImportante !== 'ninguna') {
        console.log("Fecha importante detectada: " + value.fechaImportante);
        await ImportantEvents.create({
            id: "FI-" + uuidv4(),
            eventDescription: value.descripcionFechaImportante,
            eventType: value.categoriaFechaImportante,
            eventDate: value.fechaImportante,
        })
    }
    return value.esSignificativo
}

export async function beingBriefResponse(message) {
    const messages = [
        {role: 'system', content: briefResponsePrompt},
        {role: 'user', content: message}];
    const reply = await sendMessageToAzureOpenIAWithParseJson(messages);
    //const { error, value } = validateDaniSuicideRiskResponse(reply);

    //if (error) {
    //    throw new Error(`Respuesta inválida: ${error.details[0].message}`);
    //}
    return reply
}