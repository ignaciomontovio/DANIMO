import {historicalSummaryPrompt, weeklySummaryPrompt, rangedSummaryPrompt} from "../utils/prompts/weeklySummaryPrompt.js";
import {userResponse} from "./openai.service.js";
import Conversations from "../models/Conversations.js";
import {Op} from "sequelize";

export async function weeklySummary(userId) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const SUMMARY_LENGTH = 100;
    let messages
    try {
        const messages = await getConversationMessagesForSummary(userId, weeklySummaryPrompt(SUMMARY_LENGTH), sevenDaysAgo, today);
    } catch (e) {
        return {"summary": "No hay conversaciones para resumir en los ultimos 7 dias.", "userId": userId};
    }
    const response = await userResponse(messages)
    return {"summary": response, "userId": userId};
}

export async function historicalSummary(userId) {
    const HISTORICAL_SUMMARY_LENGTH = 1000;

    // Traigo todas las conversacion del usuario
    let messages
    try{
        messages = await getConversationMessagesForSummary(userId, historicalSummaryPrompt(HISTORICAL_SUMMARY_LENGTH), new Date(2000, 0, 1), new Date());
    } catch (e) {
        return {"summary": "El usuario nunca ha interactuado con Dani.", "userId": userId};
    }
    const response = await userResponse(messages)
    return {"summary": response, "userId": userId};
}

function getConversationMessagesForSummary(userId, prompt, startDate, endDate) {
    const messages = [];
    console.log(`Summary date from ${startDate} to ${endDate}`);
    return Conversations.findAll({
        where: {
            userId,
            messageDate: {
                [Op.between]: [startDate.getTime(), endDate.getTime()]
            }
        },
        order: [['messageDate', 'ASC']]
    }).then(conversations => {
        if (conversations === null || conversations.length === 0) {
            console.log("No hay conversaciones para resumir");
            throw Error('No hay conversaciones para resumir');
        }
        conversations.forEach(({type, text, messageDate}) => {
            messages.push({
                role: type,
                content: text + `. Fecha del mensaje ${new Date(messageDate).toISOString().slice(0, 10)}`
            });
        });
        messages.push({
            role: 'user',
            content: prompt
        });

        console.log(`
        
        ${JSON.stringify(messages)}
        
        }`)
        return messages;
    });
}

export async function rangedSummmary(userId, startDate, endDate) {
    const RANGED_SUMMARY_LENGTH = 300;

    console.log(`Generando resumen para userId ${userId} entre ${startDate} y ${endDate}`);

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const prompt = rangedSummaryPrompt(RANGED_SUMMARY_LENGTH, startDate, endDate);
    let messages
    try {
        messages = await getConversationMessagesForSummary(userId, prompt, startDate, endDate);
    } catch (e) {
        return {"summary": "No hay conversaciones para resumir en el rango solicitado.", "userId": userId};
    }
    const response = await userResponse(messages);
    return {"summary": response, "userId": userId};
}