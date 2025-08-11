import {v4 as uuidv4} from 'uuid';
import Conversations from '../../models/Conversations.js';
import Users from '../../models/Users.js';

const anaEmail = 'ana@example.com';

const chatData = [
    // Día 1
    { type: 'user', text: 'Me siento un poco ansioso hoy.', date: '2025-07-27T15:36:25.605Z' },
    { type: 'assistant', text: 'Gracias por compartirlo. ¿Qué crees que está generando esa ansiedad?', date: '2025-07-27T15:37:00.000Z' },
    { type: 'user', text: 'Creo que son los problemas en el trabajo.', date: '2025-07-27T15:37:30.000Z' },
    { type: 'assistant', text: 'Entiendo. ¿Querés contarme qué pasó exactamente en el trabajo?', date: '2025-07-27T15:38:00.000Z' },

    // Día 2
    { type: 'user', text: 'Hoy me levanté más tranquilo, pero sigo preocupado.', date: '2025-07-28T09:00:00.000Z' },
    { type: 'assistant', text: 'Me alegra que te sientas algo mejor. ¿Qué pensás que ayudó?', date: '2025-07-28T09:01:00.000Z' },
    { type: 'user', text: 'Dormí un poco más anoche.', date: '2025-07-28T09:02:00.000Z' },
    { type: 'assistant', text: 'Dormir bien es muy importante para la ansiedad. ¡Buen trabajo!', date: '2025-07-28T09:03:00.000Z' },

    // Día 3
    { type: 'user', text: 'Hoy tuve una discusión en la oficina.', date: '2025-07-29T13:00:00.000Z' },
    { type: 'assistant', text: 'Lamento escuchar eso. ¿Querés hablar sobre lo que pasó?', date: '2025-07-29T13:01:00.000Z' },
    { type: 'user', text: 'Fue con mi jefe, siento que no me valora.', date: '2025-07-29T13:02:00.000Z' },
    { type: 'assistant', text: 'Eso puede ser muy frustrante. ¿Cómo te gustaría manejar esa situación?', date: '2025-07-29T13:03:00.000Z' },

    // Día 4
    { type: 'user', text: 'Hoy estuve más tranquilo, pero sigo pensando en la discusión.', date: '2025-07-30T08:30:00.000Z' },
    { type: 'assistant', text: 'Es normal que te quede dando vueltas. ¿Querés probar una técnica de relajación?', date: '2025-07-30T08:31:00.000Z' },
    { type: 'user', text: 'Sí, me gustaría aprender algo sencillo.', date: '2025-07-30T08:32:00.000Z' },
    { type: 'assistant', text: 'Podés probar respiración profunda: inhalá contando hasta 4, exhalá contando hasta 6.', date: '2025-07-30T08:33:00.000Z' },

    // Día 5
    { type: 'user', text: 'Practiqué la respiración, me ayudó un poco.', date: '2025-07-31T19:00:00.000Z' },
    { type: 'assistant', text: '¡Excelente! ¿Te gustaría que practiquemos juntos ahora?', date: '2025-07-31T19:01:00.000Z' },
    { type: 'user', text: 'Por ahora estoy bien, gracias.', date: '2025-07-31T19:02:00.000Z' },
    { type: 'assistant', text: 'Perfecto, avisame si querés retomar más tarde.', date: '2025-07-31T19:03:00.000Z' },

    // Día 6
    { type: 'user', text: 'Hoy me siento más animado.', date: '2025-08-01T10:00:00.000Z' },
    { type: 'assistant', text: '¡Qué buena noticia! ¿Qué crees que ayudó a mejorar tu ánimo?', date: '2025-08-01T10:01:00.000Z' },
    { type: 'user', text: 'Creo que salir a caminar me hizo bien.', date: '2025-08-01T10:02:00.000Z' },
    { type: 'assistant', text: 'El ejercicio al aire libre es excelente. ¡Seguí haciéndolo!', date: '2025-08-01T10:03:00.000Z' },

    // Día 7
    { type: 'user', text: 'Hoy estoy bastante tranquilo, gracias por el apoyo.', date: '2025-08-02T20:00:00.000Z' },
    { type: 'assistant', text: 'Me alegra escucharlo. Estoy acá siempre que necesites charlar.', date: '2025-08-02T20:01:00.000Z' },
    { type: 'user', text: 'Gracias, me siento acompañado.', date: '2025-08-02T20:02:00.000Z' },
    { type: 'assistant', text: 'Ese es el objetivo, ¡siempre podés contar conmigo!', date: '2025-08-02T20:03:00.000Z' },
];

export default async function seedAnaGarciaChat() {
    const ana = await Users.findOne({where: {email: anaEmail}});
    if (!ana) return;

    for (const msg of chatData) {
        const exists = await Conversations.findOne({
            where: {
                userId: ana.id, type: msg.type, text: msg.text, messageDate: new Date(msg.date)
            }
        });
        if (!exists) {
            await Conversations.create({
                id: 'C-' + uuidv4(),
                type: msg.type,
                summaryAvailable: false,
                text: msg.text,
                messageDate: new Date(msg.date),
                userId: ana.id
            });
        }
    }
}