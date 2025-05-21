const express = require('express');
const { validateDaniResponse } = require('../utils/validators');
const { UsersChats } = require('../models/UsersChats')
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

const assistant = await openai.beta.assistants.create({
    name: "Dani",
    instructions: prompt,
    model: "gpt-3.5-turbo",
});

exports.chat = async ({message, userId}) => {

    const userChat = await UsersChats.findOne({
        where: {
            userId: userId,
        }
    })
    let threadId;
    if (!userChat) {
        const thread = await openai.beta.threads.create();
        UsersChats.create({
            userId: userId, threadId: thread.id,
        })
        threadId = thread.id
    } else {
        threadId = userChat.threadId
    }


    await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistant.id,
    });

    let status;
    do {
        const currentRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
        status = currentRun.status;
        await new Promise(r => setTimeout(r, 1000)); // esperar 1 segundo
    } while (status !== "completed");

    const response = await openai.beta.threads.messages.list(threadId);
    return response;
}

