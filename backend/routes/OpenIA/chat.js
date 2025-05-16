// test.js
const express = require('express');
const router = express.Router();

const ChatGPTConversation = require('./ChatGPTConversation');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY

const dani = new ChatGPTConversation(CHATGPT_API_KEY, "Eres Dani, un acompañante emocional para jóvenes de 18 a 30 años. Respondes con calidez, claridad y empatía.");

router.post('/chat', async (req, res) => {
    const respuesta1 = await dani.sendMessage("Hoy me sentí triste porque discutí con un amigo.");
    console.log("Dani:", respuesta1);

    const respuesta2 = await dani.sendMessage("¿Qué me recomiendas hacer?");
    console.log("Dani:", respuesta2);
});

module.exports = router;
