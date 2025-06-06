const Conversations = require('../models/Conversations');
const { validateDaniResponse } = require('../utils/validators');
const axios = require('axios');
const { v4: generateUUID } = require('uuid');
const { prompt } = require('./prompt');
const { format } = require('date-fns');
require('dotenv').config();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;

exports.chat = async ({ message, userId }) => {
    // Validamos que los parámetros de entrada sean correctos
    if (!message || !userId) {
        throw new Error('El mensaje y el userId son obligatorios');
    }

    try {
        // Obtén la conversación existente y genera el historial de mensajes
        const messages = await compileConversationHistory(userId, message);

        // Envía el mensaje a la API de OpenAI y obtiene la respuesta
        const assistantReply = await sendMessageToOpenAI(messages);

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
    const messages = [{ role: 'system', content: prompt }];

    const conversations = await Conversations.findAll({ where: { userId } });
    if (conversations?.length > 0) {
        conversations
            .sort((a, b) => a.messageDate - b.messageDate)
            .forEach(({ type, text }) => {
                messages.push({ role: type, content: text });
            });
    }

    messages.push({
        role: 'user',
        content: `${currentMessage}. Debes responder con el template de salida. La fecha de hoy es ` + format(new Date(), 'yyyy-MM-dd'),
    });

    return messages;
}

// Función para enviar mensajes a la API de OpenAI
async function sendMessageToOpenAI(messages) {
    try {
        const headers = {
            Authorization: `Bearer ${CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post(OPENAI_API_URL, {
            model: 'gpt-3.5-turbo', //gpt-3.5-turbo | gpt-3.5-turbo-16k | gpt-4 | gpt-4-32k | gpt-4-32k | gpt-4-0125-preview
            messages,
        }, { headers });

        const replyContent = response.data.choices[0]?.message?.content;

        if (!replyContent) {
            throw new Error('La API de OpenAI no retornó una respuesta válida.');
        }
        console.log(replyContent);
        const parsedReply = JSON.parse(replyContent);
        const { error } = validateDaniResponse(parsedReply);

        if (error) {
            throw new Error(`Respuesta inválida: ${error.details[0].message}`);
        }

        return parsedReply.rtaParaUsuario;
    } catch (error) {
        console.error('Error al comunicarse con la API de OpenAI:', error.response?.data || error.message);
        throw new Error('Fallo al comunicarse con la API de OpenAI.');
    }
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