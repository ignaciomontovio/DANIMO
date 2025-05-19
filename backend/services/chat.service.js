const express = require('express');
const router = express.Router();

const ChatGPTConversation = require('./ChatGPTConversation');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY

const dani = new ChatGPTConversation(CHATGPT_API_KEY, "Eres Dani, un acompañante emocional para jóvenes de 18 a 30 años. Respondes con calidez, claridad y empatía.");

exports.chat = async ({message, userId}) => {
    const respuesta = await dani.sendMessage(message);
    console.log("Dani:", respuesta);
    return respuesta;
};

/*
exports.chatBeta = async ({message}) => {
    const assistant = await openai.beta.assistants.create({
        name: "Dani",
        instructions: "Sos Dani, un asistente emocional empático. No das consejos clínicos...",
        model: "gpt-3.5-turbo",
    });

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "Hola, me siento raro desde la mudanza",
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    });

    const messages = await openai.beta.threads.messages.list(thread.id);

}*/