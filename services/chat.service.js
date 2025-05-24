const express = require('express');
const { validateDaniResponse } = require('../utils/validators');
const router = express.Router();
const OpenAI = require('openai');
//Tuve que poner esto para que no me de error en los tests.
if (process.env.NODE_ENV !== 'test') {
const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_KEY,
});
}

const ChatGPTConversation = require('./ChatGPTConversation');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY
const {prompt} = require('./prompt')

const dani = new ChatGPTConversation(CHATGPT_API_KEY, prompt);

exports.chat = async ({message, userId}) => {
    const response = await dani.sendMessage(message);
    const {error} = validateDaniResponse({data:response})
    if (error) {
        throw new Error("Formato de respuesta inválido de ChatGPT. " + error.details[0].message);
    }
    return respuesta;
};


/*
exports.chat = async ({message, userId}) => {

    const assistant = await openai.beta.assistants.create({
        name: "Dani",
        instructions: prompt,
        model: "gpt-3.5-turbo",
    });

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    });

    let status;
    do {
        const currentRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        status = currentRun.status;
        await new Promise(r => setTimeout(r, 1000)); // esperar 1 segundo
    } while (status !== "completed");

    const response = await openai.beta.threads.messages.list(thread.id);
    return response;
}

 */