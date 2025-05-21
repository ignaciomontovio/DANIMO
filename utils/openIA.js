const { UsersChats } = require('../models/UsersChats')
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_KEY,
});
const {prompt} = require('../services/prompt')

exports.createAssistant = async () => {
    try {
        const assistant = await openai.beta.assistants.create({
            name: 'Dani',
            instructions: prompt, // Instrucciones iniciales del modelo
            model: 'gpt-3.5-turbo', // Modelo a usar
        });
        return assistant;
    } catch (error) {
        console.error('Error al crear el assistant:', error);
        throw new Error('No se pudo crear el asistente. Verifica tus configuraciones.');
    }
};

exports.findOrCreateThread = async ({userId}) => {
    try {
        const userChat = await UsersChats.findOne({
            where: {
                userId: userId,
            }
        });

        if (!userChat) {
            // Crear un nuevo thread si no existe para el usuario
            const thread = await openai.beta.threads.create();
            await UsersChats.create({
                userId: userId,
                threadId: thread.id,
            });
            return thread.id;
        }

        // Si ya existe, retorna su threadId
        return userChat.threadId;
    } catch (error) {
        console.error('Error al buscar o crear thread:', error);
        throw new Error('No se pudo gestionar el thread para el usuario.');
    }
};
/**
 * Polling para esperar la finalización del run con un control de tiempo.
 */
exports.waitForRunCompletion = async (threadId, runId, maxWaitTime = 60000) => {
    const interval = 1000; // Tiempo en milisegundos entre intentos
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
        const currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (currentRun.status === 'completed') {
            return openai.beta.threads.messages.list(threadId);
        }

        // Esperar antes del siguiente intento
        await new Promise((resolve) => setTimeout(resolve, interval));
        elapsed += interval;
    }

    throw new Error('El tiempo de espera para completar el run ha expirado.');
};
