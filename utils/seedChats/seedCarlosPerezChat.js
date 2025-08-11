import { v4 as uuidv4 } from 'uuid';
import Conversations from '../../models/Conversations.js';
import Users from '../../models/Users.js';

const danimoEmail = 'carlos@example.com';

// Conversaciones de enero a diciembre 2025
const chatData = [
    // ===== ENERO =====
    { type: 'user', text: 'Este año quiero realmente enfocarme en mi crecimiento personal.', date: '2025-01-02T09:00:00.000Z' },
    { type: 'assistant', text: 'Eso suena como un compromiso importante. ¿Qué aspectos te gustaría trabajar primero?', date: '2025-01-02T09:02:00.000Z' },
    { type: 'user', text: 'Quiero ser más paciente, mejorar mi comunicación y cuidar mi salud mental.', date: '2025-01-02T09:05:00.000Z' },
    { type: 'assistant', text: 'Son objetivos muy valiosos. Podemos ir abordándolos uno por uno para que no se sienta abrumador.', date: '2025-01-02T09:06:30.000Z' },
    { type: 'user', text: 'El problema es que suelo exigirme demasiado y eso me frustra.', date: '2025-01-04T20:15:00.000Z' },
    { type: 'assistant', text: 'La autoexigencia puede ser un arma de doble filo. Tal vez podríamos establecer metas más pequeñas y medibles.', date: '2025-01-04T20:17:00.000Z' },
    { type: 'user', text: 'Me gustaría intentarlo. ¿Podríamos crear un plan semanal?', date: '2025-01-04T20:18:30.000Z' },
    { type: 'assistant', text: 'Claro, empezamos con tres hábitos: escribir un diario breve, tomar pausas conscientes y practicar gratitud antes de dormir.', date: '2025-01-04T20:20:00.000Z' },
    { type: 'user', text: 'Me parece bien, mañana empiezo.', date: '2025-01-04T20:21:00.000Z' },
    { type: 'assistant', text: 'Perfecto, lo importante es la constancia. No te castigues si un día no sale perfecto.', date: '2025-01-04T20:22:00.000Z' },

    // ===== FEBRERO =====
    { type: 'user', text: 'Últimamente siento que me cuesta abrirme con la gente.', date: '2025-02-10T18:00:00.000Z' },
    { type: 'assistant', text: 'Abrirse implica vulnerabilidad, y no siempre es fácil. ¿Creés que es por miedo al juicio o a que no te entiendan?', date: '2025-02-10T18:02:00.000Z' },
    { type: 'user', text: 'Creo que es una mezcla. Me da miedo mostrar mis inseguridades.', date: '2025-02-10T18:05:00.000Z' },
    { type: 'assistant', text: 'Mostrar nuestras inseguridades puede acercarnos más a los demás, pero entiendo que requiere confianza. ¿Te gustaría trabajar en identificar espacios seguros para hacerlo?', date: '2025-02-10T18:07:30.000Z' },
    { type: 'user', text: 'Sí, tal vez pueda empezar con un par de amigos cercanos.', date: '2025-02-10T18:09:00.000Z' },
    { type: 'assistant', text: 'Es un buen comienzo. Podés contarme cómo te fue y ver si algo te incomodó o te hizo sentir bien.', date: '2025-02-10T18:10:00.000Z' },
    { type: 'user', text: 'Hoy hablé con uno de ellos y fue liberador.', date: '2025-02-15T12:00:00.000Z' },
    { type: 'assistant', text: '¡Eso es excelente! Esa experiencia positiva puede darte más confianza para abrirte con otras personas.', date: '2025-02-15T12:02:00.000Z' },

    // ===== MARZO =====
    { type: 'user', text: 'Hoy tuve una discusión fuerte en el trabajo y me dejó intranquilo.', date: '2025-03-15T14:20:00.000Z' },
    { type: 'assistant', text: 'Lamento que haya pasado. ¿Querés contarme qué lo provocó?', date: '2025-03-15T14:21:30.000Z' },
    { type: 'user', text: 'Fue por un proyecto. Sentí que no valoraron mi trabajo.', date: '2025-03-15T14:23:00.000Z' },
    { type: 'assistant', text: 'Eso puede ser muy frustrante. ¿Qué parte sentís que fue injusta?', date: '2025-03-15T14:24:30.000Z' },
    { type: 'user', text: 'Me pidieron cambios de último momento y luego criticaron que no estaba perfecto.', date: '2025-03-15T14:26:00.000Z' },
    { type: 'assistant', text: 'Tal vez podríamos preparar una forma de expresar tus límites y tu trabajo de manera constructiva.', date: '2025-03-15T14:28:00.000Z' },
    { type: 'user', text: 'Eso me ayudaría, porque en el momento me bloqueo.', date: '2025-03-15T14:30:00.000Z' },
    { type: 'assistant', text: 'Podemos hacer simulaciones para que tengas frases listas en situaciones similares.', date: '2025-03-15T14:32:00.000Z' },

    // ===== ABRIL =====
    { type: 'user', text: 'He estado practicando la meditación y me ayuda a calmar la mente.', date: '2025-04-07T08:00:00.000Z' },
    { type: 'assistant', text: '¡Excelente! ¿Notaste algún cambio en cómo reaccionás ante el estrés?', date: '2025-04-07T08:02:00.000Z' },
    { type: 'user', text: 'Sí, ahora pienso antes de responder y eso evita discusiones innecesarias.', date: '2025-04-07T08:04:00.000Z' },
    { type: 'assistant', text: 'Ese es un gran avance. La paciencia es como un músculo: mientras más la ejercites, más fuerte se vuelve.', date: '2025-04-07T08:06:00.000Z' },
    { type: 'user', text: 'También estoy durmiendo mejor.', date: '2025-04-07T08:08:00.000Z' },
    { type: 'assistant', text: 'Eso indica que tu cuerpo está sintiendo los beneficios del equilibrio mental.', date: '2025-04-07T08:10:00.000Z' },
    { type: 'user', text: 'Me gustaría incorporar estiramientos al despertar.', date: '2025-04-07T08:12:00.000Z' },
    { type: 'assistant', text: 'Perfecto, podríamos crear una rutina de 5 minutos para empezar el día con energía.', date: '2025-04-07T08:14:00.000Z' },

    // ===== MAYO =====
    { type: 'user', text: 'Siento que mi motivación bajó un poco este mes.', date: '2025-05-12T19:00:00.000Z' },
    { type: 'assistant', text: 'Es normal que haya altibajos. ¿Querés que revisemos tus objetivos para ajustarlos?', date: '2025-05-12T19:02:00.000Z' },
    { type: 'user', text: 'Sí, creo que necesito metas más pequeñas.', date: '2025-05-12T19:04:00.000Z' },
    { type: 'assistant', text: 'Podríamos establecer mini-retos semanales para mantener el impulso.', date: '2025-05-12T19:06:00.000Z' },
    { type: 'user', text: 'Me gusta la idea. Esta semana podría enfocarme solo en escribir mi diario cada día.', date: '2025-05-12T19:08:00.000Z' },
    { type: 'assistant', text: 'Perfecto, y podemos revisar juntos lo que escribas para encontrar patrones positivos.', date: '2025-05-12T19:10:00.000Z' },
    { type: 'user', text: 'Ya llevo tres días seguidos.', date: '2025-05-15T21:00:00.000Z' },
    { type: 'assistant', text: '¡Excelente! Esa consistencia es justo lo que fortalece el hábito.', date: '2025-05-15T21:02:00.000Z' },

    // ===== JUNIO =====
    { type: 'user', text: 'Este mes intenté ser más constante con el ejercicio.', date: '2025-06-05T07:30:00.000Z' },
    { type: 'assistant', text: '¡Bien hecho! ¿Qué tipo de actividad elegiste?', date: '2025-06-05T07:32:00.000Z' },
    { type: 'user', text: 'Caminatas de 30 minutos y algo de yoga en casa.', date: '2025-06-05T07:34:00.000Z' },
    { type: 'assistant', text: 'Es una combinación excelente: cardio suave y flexibilidad.', date: '2025-06-05T07:36:00.000Z' },
    { type: 'user', text: 'Algunos días me costó empezar, pero me sentí mejor después.', date: '2025-06-05T07:38:00.000Z' },
    { type: 'assistant', text: 'Eso es clave: recordar cómo te sentís después para motivarte.', date: '2025-06-05T07:40:00.000Z' },
    { type: 'user', text: 'Voy a tratar de llegar a 4 días por semana.', date: '2025-06-05T07:42:00.000Z' },
    { type: 'assistant', text: 'Meta alcanzable. Podemos hacer seguimiento semanal.', date: '2025-06-05T07:44:00.000Z' },

    // ===== JULIO =====
    { type: 'user', text: 'Este mes me sentí un poco más irritable.', date: '2025-07-09T21:00:00.000Z' },
    { type: 'assistant', text: '¿Identificaste alguna causa específica?', date: '2025-07-09T21:02:00.000Z' },
    { type: 'user', text: 'Creo que es por el exceso de trabajo y poco descanso.', date: '2025-07-09T21:04:00.000Z' },
    { type: 'assistant', text: 'Podríamos establecer pausas cortas cada dos horas para reducir tensión.', date: '2025-07-09T21:06:00.000Z' },
    { type: 'user', text: 'Podría poner alarmas como recordatorio.', date: '2025-07-09T21:08:00.000Z' },
    { type: 'assistant', text: 'Perfecto. También ayuda cerrar los ojos y respirar profundo por un minuto.', date: '2025-07-09T21:10:00.000Z' },
    { type: 'user', text: 'Lo probaré desde mañana.', date: '2025-07-09T21:12:00.000Z' },
    { type: 'assistant', text: 'Luego contame si sentís menos tensión.', date: '2025-07-09T21:14:00.000Z' },

    // ===== AGOSTO =====
    { type: 'user', text: 'Empecé a leer un libro sobre inteligencia emocional.', date: '2025-08-03T16:00:00.000Z' },
    { type: 'assistant', text: 'Interesante, ¿qué aprendiste hasta ahora?', date: '2025-08-03T16:02:00.000Z' },
    { type: 'user', text: 'Que reconocer mis emociones es el primer paso para gestionarlas.', date: '2025-08-03T16:04:00.000Z' },
    { type: 'assistant', text: 'Exacto, la autoconciencia es la base de todo crecimiento emocional.', date: '2025-08-03T16:06:00.000Z' },
    { type: 'user', text: 'También me di cuenta de que a veces reprimo lo que siento.', date: '2025-08-03T16:08:00.000Z' },
    { type: 'assistant', text: 'Podemos trabajar en expresarlo de forma sana, sin guardarlo.', date: '2025-08-03T16:10:00.000Z' },
    { type: 'user', text: 'Sí, creo que eso me aliviaría mucho.', date: '2025-08-03T16:12:00.000Z' },
    { type: 'assistant', text: 'Entonces este mes practicaremos poner en palabras tus emociones.', date: '2025-08-03T16:14:00.000Z' },

];

export default async function seedDanimoChat() {
    const danimo = await Users.findOne({ where: { email: danimoEmail } });
    if (!danimo) return;

    for (const msg of chatData) {
        const exists = await Conversations.findOne({
            where: {
                userId: danimo.id,
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
                userId: danimo.id
            });
        }
    }
}
