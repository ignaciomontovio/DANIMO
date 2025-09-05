
import { v4 as uuidv4 } from 'uuid';
import Conversations from '../../models/Conversations.js';
import Users from '../../models/Users.js';

const mariaEmail = 'maria@example.com';

const mensajesPorDia = [
    [
        { type: 'user', text: 'Me desperté con ansiedad.' },
        { type: 'assistant', text: '¿Recuerdas qué la provocó?' },
        { type: 'user', text: 'Pensé en el trabajo apenas abrí los ojos.' },
        { type: 'assistant', text: '¿Dormiste bien anoche?' },
        { type: 'user', text: 'No mucho, tuve insomnio.' },
        { type: 'assistant', text: '¿Probaste alguna técnica de relajación?' },
        { type: 'user', text: 'No, pero podría intentarlo mañana.' },
        { type: 'assistant', text: 'Te sugiero respiración profunda antes de dormir.' }
    ],
    [
        { type: 'user', text: 'Almorcé sola hoy.' },
        { type: 'assistant', text: '¿Te sentiste cómoda o incómoda?' },
        { type: 'user', text: 'Un poco incómoda, pero lo necesitaba.' },
        { type: 'assistant', text: '¿Qué hiciste después de almorzar?' },
        { type: 'user', text: 'Salí a caminar.' },
        { type: 'assistant', text: '¿Te ayudó a despejarte?' },
        { type: 'user', text: 'Sí, me sentí mejor después.' },
        { type: 'assistant', text: '¡Genial! El ejercicio ayuda mucho.' }
    ],
    [
        { type: 'user', text: 'Me costó concentrarme en la tarde.' },
        { type: 'assistant', text: '¿Probaste alguna técnica de respiración?' },
        { type: 'user', text: 'No, pero podría intentarlo mañana.' },
        { type: 'assistant', text: '¿Qué te gustaría probar?' },
        { type: 'user', text: 'Quizás meditación guiada.' },
        { type: 'assistant', text: 'Te puedo recomendar una app si quieres.' },
        { type: 'user', text: 'Sí, por favor.' },
        { type: 'assistant', text: 'Busca “Calm” o “Headspace”.' }
    ],
    [
        { type: 'user', text: 'Hoy salí a caminar.' },
        { type: 'assistant', text: '¿Te ayudó a despejarte?' },
        { type: 'user', text: 'Sí, me sentí mejor después.' },
        { type: 'assistant', text: '¿Cuánto tiempo caminaste?' },
        { type: 'user', text: 'Casi una hora.' },
        { type: 'assistant', text: '¡Muy bien! ¿Lo harás mañana también?' },
        { type: 'user', text: 'Sí, lo intentaré.' },
        { type: 'assistant', text: 'La constancia es clave.' }
    ],
    [
        { type: 'user', text: 'Me sentí cansada todo el día.' },
        { type: 'assistant', text: '¿Dormiste bien anoche?' },
        { type: 'user', text: 'No mucho, tuve insomnio.' },
        { type: 'assistant', text: '¿Qué te ayudó a relajarte?' },
        { type: 'user', text: 'Escuché música tranquila.' },
        { type: 'assistant', text: '¿Te ayudó a dormir mejor?' },
        { type: 'user', text: 'Un poco, pero sigo cansada.' },
        { type: 'assistant', text: 'Intenta una rutina de sueño regular.' }
    ],
    [
        { type: 'user', text: 'Hablé con una amiga por teléfono.' },
        { type: 'assistant', text: '¿Te hizo sentir acompañada?' },
        { type: 'user', text: 'Sí, me levantó el ánimo.' },
        { type: 'assistant', text: '¿De qué hablaron?' },
        { type: 'user', text: 'De nuestras familias.' },
        { type: 'assistant', text: '¿Te gustaría hablar más seguido?' },
        { type: 'user', text: 'Sí, lo intentaré.' },
        { type: 'assistant', text: 'Las amistades son importantes.' }
    ],
    [
        { type: 'user', text: 'Hoy cociné mi plato favorito.' },
        { type: 'assistant', text: '¿Te gustó el resultado?' },
        { type: 'user', text: 'Sí, fue reconfortante.' },
        { type: 'assistant', text: '¿Cocinas seguido?' },
        { type: 'user', text: 'No tanto, pero quiero hacerlo más.' },
        { type: 'assistant', text: '¡Es una buena idea!' },
        { type: 'user', text: 'Me ayuda a relajarme.' },
        { type: 'assistant', text: 'La cocina puede ser terapéutica.' }
    ]
];

export default async function seedMariaRuizChat() {
    const maria = await Users.findOne({ where: { email: mariaEmail } });
    if (!maria) return;

    await Conversations.destroy({ where: { userId: maria.id } });

    const now = new Date();
    for (let d = 0; d < mensajesPorDia.length; d++) {
        for (let h = 0; h < mensajesPorDia[d].length; h++) {
            const msg = mensajesPorDia[d][h];
            const msgDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - (6 - d), // 7 días atrás hasta hoy
                8 + h * 2, 0, 0 // Horas: 8, 10, 12, 14, 16, 18, 20, 22 UTC
            ));

            await Conversations.create({
                id: 'C-' + uuidv4(),
                type: msg.type,
                summaryAvailable: false,
                text: msg.text,
                messageDate: msgDate,
                userId: maria.id
            });
        }
    }
}