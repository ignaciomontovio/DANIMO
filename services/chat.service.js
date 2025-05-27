const Conversations = require('../models/Conversations');
const {validateDaniResponse} = require('../utils/validators')
const axios = require('axios');
const {v4} = require('uuid');
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY
const {prompt} = require('./prompt')

exports.chat = async ({message, userId}) => {
    let messages = [{role: 'system', content: prompt}]
    const conversation = await Conversations.findAll({where: {userId}});
    if (conversation != null)
        conversation
            .sort((a, b) => a.messageDate - b.messageDate)
            .forEach(element => (messages.push({role: element.type, content: element.text})))
    messages.push({role: 'user', content: message + ". Debes responder con el template de salida."})
    console.log(messages)

    const reply = await sendMessage(messages)
    console.log(messages)

    await Conversations.create({
        id: "C-" + v4(),
        type: "user",
        summaryAvailable: false,
        text: message,
        messageDate: Date.now(),
        userId: userId
    })
    await Conversations.create({
        id: "C-" + v4(),
        type: "assistant",
        summaryAvailable: false,
        text: reply,
        messageDate: Date.now(),
        userId: userId
    })
    return reply
}

async function sendMessage(messages) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: messages
        }, {
            headers: {
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const reply = response.data.choices[0].message.content;
        console.log("REPLY " + reply)
        const parsedReply = JSON.parse(reply);

        console.log(reply)
        const {error} = validateDaniResponse(parsedReply)

        if (error) {
            throw new Error(error.details[0].message)
        }
        return parsedReply.rtaParaUsuario
    } catch (error) {
        console.error("Error al enviar mensaje a ChatGPT:", error.response?.data || error.message);
        throw new Error("Fallo al comunicarse con la API de OpenAI.");
    }
}


