// utils/seedChats/seedLuisMartinezChat.js
import { v4 as uuidv4 } from 'uuid';
import Conversations from '../../models/Conversations.js';
import Users from '../../models/Users.js';

const luisEmail = 'luis@example.com';

const chatData = [
    // Enero
    { type: 'user', text: 'Empecé el año con ganas de mejorar mi salud.', date: '2025-01-02T08:15:00.000Z' },
    { type: 'assistant', text: '¡Excelente! ¿Qué cambios te gustaría hacer?', date: '2025-01-02T08:16:00.000Z' },
    { type: 'user', text: 'Quiero empezar a correr y comer mejor.', date: '2025-01-03T19:30:00.000Z' },
    { type: 'assistant', text: '¡Muy buenos objetivos! ¿Ya comenzaste?', date: '2025-01-03T19:31:00.000Z' },
    { type: 'user', text: 'Hoy me costó levantarme temprano.', date: '2025-01-05T07:45:00.000Z' },
    { type: 'assistant', text: 'A veces cuesta, pero podés intentarlo mañana de nuevo.', date: '2025-01-05T07:46:00.000Z' },
    { type: 'user', text: '¿Algún consejo para mantener la motivación?', date: '2025-01-07T20:00:00.000Z' },
    { type: 'assistant', text: 'Podés anotar tus avances y celebrar los pequeños logros.', date: '2025-01-07T20:01:00.000Z' },
    { type: 'user', text: 'Me siento un poco estresado por el trabajo.', date: '2025-01-09T18:30:00.000Z' },
    { type: 'assistant', text: '¿Querés contarme qué te preocupa?', date: '2025-01-09T18:31:00.000Z' },
    { type: 'user', text: 'Tengo muchas reuniones y poco tiempo libre.', date: '2025-01-11T09:10:00.000Z' },
    { type: 'assistant', text: '¿Probaste organizar tus tareas por prioridad?', date: '2025-01-11T09:11:00.000Z' },
    { type: 'user', text: 'Hoy salí a caminar y me sentí mejor.', date: '2025-01-13T07:45:00.000Z' },
    { type: 'assistant', text: 'El ejercicio ayuda mucho. ¡Seguí así!', date: '2025-01-13T07:46:00.000Z' },
    { type: 'user', text: '¿Qué otros hábitos saludables puedo sumar?', date: '2025-01-15T21:00:00.000Z' },
    { type: 'assistant', text: 'Podés probar meditación o leer antes de dormir.', date: '2025-01-15T21:01:00.000Z' },
    { type: 'user', text: 'Me siento más positivo esta semana.', date: '2025-01-18T10:00:00.000Z' },
    { type: 'assistant', text: '¡Qué buena noticia! ¿Qué crees que ayudó?', date: '2025-01-18T10:01:00.000Z' },
    { type: 'user', text: 'Salí con amigos y me despejé.', date: '2025-01-20T18:00:00.000Z' },
    { type: 'assistant', text: 'Las relaciones sociales son clave para el bienestar.', date: '2025-01-20T18:01:00.000Z' },

    // Febrero
    { type: 'user', text: 'Hoy fui al supermercado y estaba lleno.', date: '2025-02-01T09:10:00.000Z' },
    { type: 'assistant', text: '¡Qué paciencia! ¿Pudiste comprar todo lo que necesitabas?', date: '2025-02-01T09:12:00.000Z' },
    { type: 'user', text: 'Sí, pero olvidé comprar café.', date: '2025-02-01T09:13:00.000Z' },
    { type: 'assistant', text: 'Siempre pasa, ¿vas a volver por el café?', date: '2025-02-01T09:15:00.000Z' },
    { type: 'user', text: 'Hoy llovió y tuve que esperar el colectivo.', date: '2025-02-05T18:00:00.000Z' },
    { type: 'assistant', text: '¿Llegaste a tiempo a tu destino?', date: '2025-02-05T18:02:00.000Z' },
    { type: 'user', text: 'Sí, pero me mojé bastante.', date: '2025-02-05T18:03:00.000Z' },
    { type: 'assistant', text: '¡Qué mal! ¿Pudiste cambiarte al llegar?', date: '2025-02-05T18:05:00.000Z' },
    { type: 'user', text: 'Recibí una llamada inesperada de mi hermana.', date: '2025-02-09T10:00:00.000Z' },
    { type: 'assistant', text: '¿Fue una buena charla?', date: '2025-02-09T10:02:00.000Z' },
    { type: 'user', text: 'Sí, hablamos de la familia.', date: '2025-02-09T10:03:00.000Z' },
    { type: 'assistant', text: '¡Qué lindo! ¿Hace mucho que no hablaban?', date: '2025-02-09T10:05:00.000Z' },
    { type: 'user', text: 'Hoy cociné pasta para cenar.', date: '2025-02-12T20:30:00.000Z' },
    { type: 'assistant', text: '¡Qué rico! ¿Le pusiste alguna salsa especial?', date: '2025-02-12T20:32:00.000Z' },
    { type: 'user', text: 'Sí, salsa de tomate casera.', date: '2025-02-12T20:33:00.000Z' },
    { type: 'assistant', text: 'Suena delicioso, ¿te gusta cocinar seguido?', date: '2025-02-12T20:35:00.000Z' },
    { type: 'user', text: 'Hoy salí a pasear por el parque.', date: '2025-02-17T17:45:00.000Z' },
    { type: 'assistant', text: '¿Había mucha gente? ¿Te gustó el paseo?', date: '2025-02-17T17:47:00.000Z' },
    { type: 'user', text: 'No, estaba tranquilo y disfruté el aire libre.', date: '2025-02-17T17:48:00.000Z' },
    { type: 'assistant', text: '¡Qué bien! Es lindo desconectarse un rato.', date: '2025-02-17T17:50:00.000Z' },

    // Marzo
    { type: 'user', text: 'Hoy tuve un problema en el trabajo que me dejó preocupado.', date: '2025-03-12T08:10:00.000Z' },
    { type: 'assistant', text: '¿Querés contarme qué pasó?', date: '2025-03-12T08:12:00.000Z' },
    { type: 'user', text: 'Discutí con mi jefe por una entrega que salió mal.', date: '2025-03-12T08:13:00.000Z' },
    { type: 'assistant', text: 'Eso debe haber sido difícil. ¿Cómo te sentiste en ese momento?', date: '2025-03-12T08:15:00.000Z' },
    { type: 'user', text: 'Me sentí frustrado y un poco impotente.', date: '2025-03-12T08:16:00.000Z' },
    { type: 'assistant', text: '¿Creés que fue justo lo que te dijo tu jefe?', date: '2025-03-12T08:18:00.000Z' },
    { type: 'user', text: 'Creo que exageró, pero entiendo que estaba bajo presión.', date: '2025-03-12T08:19:00.000Z' },
    { type: 'assistant', text: '¿Pudiste hablar con alguien más del equipo sobre esto?', date: '2025-03-12T08:21:00.000Z' },
    { type: 'user', text: 'Sí, un compañero me apoyó y me dijo que no era mi culpa.', date: '2025-03-12T08:22:00.000Z' },
    { type: 'assistant', text: 'Eso ayuda mucho. ¿Pensás hablar de nuevo con tu jefe?', date: '2025-03-12T08:24:00.000Z' },
    { type: 'user', text: 'Todavía no sé, tengo miedo de que se enoje más.', date: '2025-03-12T08:25:00.000Z' },
    { type: 'assistant', text: 'Es normal sentir ese temor. ¿Te gustaría preparar lo que vas a decirle?', date: '2025-03-12T08:27:00.000Z' },
    { type: 'user', text: 'Sí, creo que me ayudaría a sentirme más seguro.', date: '2025-03-12T08:28:00.000Z' },
    { type: 'assistant', text: 'Podemos pensar juntos cómo plantearlo si querés.', date: '2025-03-12T08:30:00.000Z' },
    { type: 'user', text: 'Me gustaría explicarle que hice lo mejor posible con los recursos que tenía.', date: '2025-03-12T08:31:00.000Z' },
    { type: 'assistant', text: 'Eso suena razonable. ¿Querés practicar cómo decírselo?', date: '2025-03-12T08:33:00.000Z' },
    { type: 'user', text: 'Sí, podríamos simular la conversación.', date: '2025-03-12T08:34:00.000Z' },
    { type: 'assistant', text: 'Perfecto, empezá cuando quieras y te ayudo a ajustar lo que digas.', date: '2025-03-12T08:36:00.000Z' },
    { type: 'user', text: 'Gracias, me siento un poco más tranquilo ahora.', date: '2025-03-12T08:37:00.000Z' },
    { type: 'assistant', text: 'Me alegra saberlo. Estoy acá para acompañarte en lo que necesites.', date: '2025-03-12T08:39:00.000Z' },

    // Abril
    { type: 'user', text: 'Hoy salí a caminar y me sentí mejor.', date: '2025-04-02T07:45:00.000Z' },
    { type: 'assistant', text: 'El ejercicio ayuda mucho. ¡Seguí así!', date: '2025-04-02T07:46:00.000Z' },
    { type: 'user', text: '¿Qué otros hábitos saludables puedo sumar?', date: '2025-04-18T21:00:00.000Z' },
    { type: 'assistant', text: 'Podés probar meditación o leer antes de dormir.', date: '2025-04-18T21:01:00.000Z' },

    // Mayo
    { type: 'user', text: 'Me siento más positivo este mes.', date: '2025-05-06T10:00:00.000Z' },
    { type: 'assistant', text: '¡Qué buena noticia! ¿Qué crees que ayudó?', date: '2025-05-06T10:01:00.000Z' },
    { type: 'user', text: 'Salí con amigos y me despejé.', date: '2025-05-20T18:00:00.000Z' },
    { type: 'assistant', text: 'Las relaciones sociales son clave para el bienestar.', date: '2025-05-20T18:01:00.000Z' },

    // Junio
    { type: 'user', text: 'Tuve una discusión con un colega.', date: '2025-06-11T14:20:00.000Z' },
    { type: 'assistant', text: '¿Cómo te sentís ahora?', date: '2025-06-11T14:21:00.000Z' },
    { type: 'user', text: 'Todavía un poco molesto, pero estoy mejor.', date: '2025-06-25T16:30:00.000Z' },
    { type: 'assistant', text: '¿Te gustaría hablar sobre cómo resolverlo?', date: '2025-06-25T16:31:00.000Z' },

    // Julio
    { type: 'user', text: 'Estoy pensando en tomar vacaciones.', date: '2025-07-04T09:00:00.000Z' },
    { type: 'assistant', text: '¡Es una gran idea para recargar energías!', date: '2025-07-04T09:01:00.000Z' },
    { type: 'user', text: '¿Algún destino recomendado?', date: '2025-07-18T11:00:00.000Z' },
    { type: 'assistant', text: 'Podés elegir algún lugar tranquilo cerca de la naturaleza.', date: '2025-07-18T11:01:00.000Z' },

    // Agosto
    { type: 'user', text: 'Volví de las vacaciones, me siento renovado.', date: '2025-08-05T08:30:00.000Z' },
    { type: 'assistant', text: '¡Me alegra mucho! ¿Qué fue lo que más disfrutaste?', date: '2025-08-05T08:31:00.000Z' },
    { type: 'user', text: 'Descansar y desconectarme del trabajo.', date: '2025-08-20T20:00:00.000Z' },
    { type: 'assistant', text: 'Es fundamental cuidar esos espacios. ¡Bien hecho!', date: '2025-08-20T20:01:00.000Z' },
];

export default async function seedLuisMartinezChat() {
    const luis = await Users.findOne({ where: { email: luisEmail } });
    if (!luis) return;

    for (const msg of chatData) {
        const exists = await Conversations.findOne({
            where: {
                userId: luis.id,
                type: msg.type,
                text: msg.text,
                messageDate: new Date(msg.date)
            }
        });
        if (!exists) {
            await Conversations.create({
                id: 'C-' + uuidv4(),
                type: msg.type,
                summaryAvailable: false,
                text: msg.text,
                messageDate: new Date(msg.date),
                userId: luis.id
            });
        }
    }
}