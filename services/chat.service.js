const express = require('express');
const { validateDaniResponse } = require('../utils/validators');
const { createAssistant, findOrCreateThread, waitForRunCompletion } = require('../utils/openIA');
const router = express.Router();
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_KEY,
});

const ChatGPTConversation = require('./ChatGPTConversation');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY
const {prompt} = require('./prompt')

const dani = new ChatGPTConversation(CHATGPT_API_KEY, prompt);
/*
exports.chat = async ({message, userId}) => {
    const response = await dani.sendMessage(message);
    const {error} = validateDaniResponse({data:response})
    if (error) {
        throw new Error("Formato de respuesta inválido de ChatGPT. " + error.details[0].message);
    }
    return respuesta;
};
*/

exports.chat = async ({ message, userId }) => {
    const assistant = await createAssistant(); // Crear el assistant
    const threadId = await findOrCreateThread({userId: userId}); // Buscar o crear un thread

    try {
        // Crear el mensaje del usuario en el thread correspondiente
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message,
        });

        // Ejecutar el modelo en el thread existente
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistant.id,
        });

        // Esperar a que el run se complete (reemplazar polling por manejo eficiente)
        const response = await waitForRunCompletion({threadId: threadId, runId: run.id});

        return response; // Devuelve la respuesta final
    } catch (error) {
        console.error('Error durante la ejecución del chat:', error);
        throw new Error('Error al procesar la conversación con el asistente.');
    }
};

