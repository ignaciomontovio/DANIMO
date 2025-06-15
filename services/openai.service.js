import {validateDaniSuicideRiskResponse} from "../utils/validators";
import {suicideRiskPrompt} from "../utils/prompts/suicideRiskPrompt";
import {importantDatePrompt} from "../utils/prompts/importantDatePrompt";

import axios from "axios";
import { validateDaniResponse } from "../utils/validators";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;

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

// Función para enviar mensajes a la API de OpenAI
export async function userResponse(messages) {
    try {
        const reply = await sendMessageToOpenIA(messages);

        const { error } = validateDaniResponse(reply);

        if (error) {
            throw new Error(`Respuesta inválida: ${error.details[0].message}`);
        }

        return parsedReply.rtaParaUsuario;
    } catch (error) {
        console.error('Error al comunicarse con la API de OpenAI:', error.response?.data || error.message);
        throw new Error('Fallo al comunicarse con la API de OpenAI.');
    }
}

export async function suicideRiskResponse(message) {
    const messages = [
        {role: 'system', content: suicideRiskPrompt},
        {role: 'user', content: message}];
    const reply = await sendMessageToOpenIA(messages);
    const { error, value } = validateDaniSuicideRiskResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida: ${error.details[0].message}`);
    }
    return value.suicideRiskDetected === 'true'
}

export async function dateEvaluationResponse(message) {
    const messages = [
        {role: 'system', content: importantDatePrompt},
        {role: 'user', content: message}];
    const reply = await sendMessageToOpenIA(messages);
    const { error, value } = validateDaniSuicideRiskResponse(reply);

    if (error) {
        throw new Error(`Respuesta inválida: ${error.details[0].message}`);
    }
    return value.suicideRiskDetected === 'true'
}