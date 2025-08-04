import {historicalSummaryPrompt, summaryPrompt, rangeSummaryPrompt} from "../utils/prompts/summaryPrompt.js";
import {userResponse} from "./openai.service.js";
import Conversations from "../models/Conversations.js";
import {Op} from "sequelize";

export async function summary(userId, startDate, endDate, summaryLength) {
    const messages = await compileConversationHistoryForSummary(userId, summaryPrompt(summaryLength), startDate, endDate);
    const response = await userResponse(messages)
    return {"summary": response, "userId": userId};
}

export async function historicalSummary(userId,summaryLength) {
    const messages = await compileConversationHistoryForSummary(userId, historicalSummaryPrompt(summaryLength), new Date(2000, 0, 1), new Date());
    const response = await userResponse(messages)
    return {"summary": response, "userId": userId};
}

function compileConversationHistoryForSummary(userId, prompt, startDate, endDate) {
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
            content: prompt + ". El dia de hoy es " + new Date().toISOString().slice(0, 10)
        });

        console.log(`
        
        ${JSON.stringify(messages)}
        
        }`)
        return messages;
    });
}

export async function createSummary(userId, startDate, endDate) {
    console.log(`Generando resumen para userId ${userId} entre ${startDate} y ${endDate}`);

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    // Buscar conversaciones del usuario en el rango indicado
    const conversations = await Conversations.findAll({
        where: {
            userId,
            type: 'user', // Solo mensajes del usuario
            messageDate: {
                [Op.between]: [startDate.getTime(), endDate.getTime()]
            }
        },
        order: [['messageDate', 'ASC']]
    });

    if (!conversations || conversations.length === 0) {
        const error = new Error('No hay conversaciones para resumir en el rango de fechas proporcionado');
        error.statusCode = 404;
        throw error;
    }

    //Longitud del resumen en palabras
    const summaryLength = 300;

    // Construir el prompt para IA
    const messages = [{role: 'system', content: rangeSummaryPrompt(summaryLength,startDate,endDate)}];
    conversations.forEach(({text, messageDate}) => {
        messages.push({
            role: 'user',
            content: `${text} (Fecha: ${new Date(messageDate).toISOString().slice(0, 10)})`
        });
    });

    // Agregar indicación final
    //messages.push({
    //    role: 'user',
    //    content: `Por favor genera un resumen claro y conciso. Hoy es ${new Date().toISOString().slice(0, 10)}`
    //});

    // Llamar a la IA para generar resumen
    const aiResponse = await userResponse(messages);

    return {
        summary: aiResponse,
        userId: userId
    };
}