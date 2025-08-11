import { v4 as uuidv4 } from 'uuid';
import Conversations from '../../models/Conversations.js';
import Users from '../../models/Users.js';

const luisEmail = 'pedro@example.com';

const chatData = [
    // 2025-01-01
    { type: 'user', text: 'Hoy fue difícil. Discutí con mi hermano en la cena de Año Nuevo.', date: '2025-01-01T20:00:00.000Z' },
    { type: 'assistant', text: 'Lamento escuchar eso. ¿Qué fue lo que desencadenó la discusión?', date: '2025-01-01T20:01:30.000Z' },
    { type: 'user', text: 'Comentó algo sobre mis decisiones laborales y me sentí juzgado.', date: '2025-01-01T20:03:00.000Z' },
    { type: 'assistant', text: '¿Era algo que ya venías sintiendo antes o fue inesperado?', date: '2025-01-01T20:04:30.000Z' },
    { type: 'user', text: 'Ya lo venía sintiendo. Siempre hace comentarios así, pero esta vez me cansé.', date: '2025-01-01T20:06:00.000Z' },
    { type: 'assistant', text: 'Entiendo. Cuando las críticas se repiten, es normal que se acumule el malestar. ¿Qué hiciste después de la discusión?', date: '2025-01-01T20:07:30.000Z' },
    { type: 'user', text: 'Me fui de la mesa. No quería seguir peleando.', date: '2025-01-01T20:09:00.000Z' },
    { type: 'assistant', text: 'Eso evitó que la situación escalara, pero quizás también te dejó con sensaciones sin resolver.', date: '2025-01-01T20:10:30.000Z' },
    { type: 'user', text: 'Sí, ahora me siento culpable por arruinar el ambiente.', date: '2025-01-01T20:12:00.000Z' },
    { type: 'assistant', text: 'Sentirte así es humano, pero no es solo tu responsabilidad. Podrías buscar un momento tranquilo para hablar con él y explicar cómo te afectan sus comentarios.', date: '2025-01-01T20:13:30.000Z' },
    { type: 'user', text: 'Quizás lo haga en unos días, cuando estemos más calmados.', date: '2025-01-01T20:15:00.000Z' },
    { type: 'assistant', text: 'Buena idea. Dar espacio ayuda a que ambos puedan escucharse mejor.', date: '2025-01-01T20:16:30.000Z' },

    // 2025-01-02
    { type: 'user', text: 'Estoy preocupado por mis finanzas. Gasté demasiado en diciembre.', date: '2025-01-02T09:00:00.000Z' },
    { type: 'assistant', text: '¿Ya revisaste exactamente cuánto gastaste y en qué?', date: '2025-01-02T09:02:00.000Z' },
    { type: 'user', text: 'Sí, pero me da vergüenza admitirlo. Fueron muchas salidas y regalos.', date: '2025-01-02T09:04:00.000Z' },
    { type: 'assistant', text: 'No sirve castigarte ahora. Lo importante es qué vas a hacer para equilibrar este mes.', date: '2025-01-02T09:06:00.000Z' },
    { type: 'user', text: 'Pensaba recortar comidas afuera y entretenimiento.', date: '2025-01-02T09:08:00.000Z' },
    { type: 'assistant', text: 'Eso puede ayudar, pero también podrías buscar ingresos extra, aunque sean temporales.', date: '2025-01-02T09:10:00.000Z' },
    { type: 'user', text: 'Lo pensé, pero me cuesta encontrar algo rápido.', date: '2025-01-02T09:12:00.000Z' },
    { type: 'assistant', text: 'Tal vez podrías vender cosas que no uses o hacer trabajos puntuales. ¿Tenés algo así a mano?', date: '2025-01-02T09:14:00.000Z' },
    { type: 'user', text: 'Sí, tengo una bicicleta vieja que ya no uso.', date: '2025-01-02T09:16:00.000Z' },
    { type: 'assistant', text: 'Perfecto. Venderla podría darte un respiro inicial mientras ajustás tus gastos.', date: '2025-01-02T09:18:00.000Z' },
    { type: 'user', text: 'Me alivia tener un plan, aunque no es fácil aceptarlo.', date: '2025-01-02T09:20:00.000Z' },
    { type: 'assistant', text: 'Lo importante es que ya estás tomando el control en vez de quedarte paralizado.', date: '2025-01-02T09:22:00.000Z' },

    // 2025-01-03
    { type: 'user', text: 'Hoy sentí que no paré de trabajar ni un minuto.', date: '2025-01-03T19:00:00.000Z' },
    { type: 'assistant', text: '¿Fue un día excepcionalmente ocupado o es la norma últimamente?', date: '2025-01-03T19:02:00.000Z' },
    { type: 'user', text: 'Últimamente todo está así, pero hoy se pasó de la raya.', date: '2025-01-03T19:04:00.000Z' },
    { type: 'assistant', text: '¿Pudiste tomar descansos?', date: '2025-01-03T19:06:00.000Z' },
    { type: 'user', text: 'No, porque si paro, siento que después no me alcanza el tiempo.', date: '2025-01-03T19:08:00.000Z' },
    { type: 'assistant', text: 'Eso suena agotador. Trabajar sin pausas no solo te cansa físicamente, también afecta tu claridad mental.', date: '2025-01-03T19:10:00.000Z' },
    { type: 'user', text: 'Sí, y encima llegué a casa sin energía para nada.', date: '2025-01-03T19:12:00.000Z' },
    { type: 'assistant', text: 'Quizás puedas probar con micro descansos de 5 minutos para despejarte. A veces eso incluso mejora la productividad.', date: '2025-01-03T19:14:00.000Z' },
    { type: 'user', text: 'Podría intentarlo mañana, aunque me cueste.', date: '2025-01-03T19:16:00.000Z' },
    { type: 'assistant', text: 'Es un buen comienzo. Lo importante es que empieces a priorizar tu salud, incluso en días cargados.', date: '2025-01-03T19:18:00.000Z' },

    // 2025-01-04
    { type: 'user', text: 'Hoy me levanté tarde y sentí que perdí medio día.', date: '2025-01-04T10:00:00.000Z' },
    { type: 'assistant', text: '¿Fue porque te acostaste muy tarde o porque estabas agotado?', date: '2025-01-04T10:02:00.000Z' },
    { type: 'user', text: 'Me quedé viendo videos hasta las 2 de la mañana. Quería relajarme, pero me pasé.', date: '2025-01-04T10:04:00.000Z' },
    { type: 'assistant', text: 'Eso pasa. El problema es que al final te quita energía para el día siguiente.', date: '2025-01-04T10:06:00.000Z' },
    { type: 'user', text: 'Exacto. Y ahora tengo un montón de cosas atrasadas.', date: '2025-01-04T10:08:00.000Z' },
    { type: 'assistant', text: 'Tal vez puedas priorizar solo lo esencial hoy, y lo demás dejarlo para mañana.', date: '2025-01-04T10:10:00.000Z' },
    { type: 'user', text: 'Me cuesta dejar cosas para después, siento que me atraso más.', date: '2025-01-04T10:12:00.000Z' },
    { type: 'assistant', text: 'Podríamos hacer una lista de tres tareas clave. Así te aseguras de avanzar sin sobrecargarte.', date: '2025-01-04T10:14:00.000Z' },
    { type: 'user', text: 'Vale, hoy haré la compra, limpiaré la cocina y responderé correos.', date: '2025-01-04T10:16:00.000Z' },
    { type: 'assistant', text: 'Perfecto. Si sobra tiempo, ya será un bonus, no una obligación.', date: '2025-01-04T10:18:00.000Z' },

    // 2025-01-05
    { type: 'user', text: 'Hoy tuve un mal día en el trabajo. Un cliente me gritó.', date: '2025-01-05T18:00:00.000Z' },
    { type: 'assistant', text: 'Debe haber sido muy incómodo. ¿Qué fue lo que lo molestó?', date: '2025-01-05T18:02:00.000Z' },
    { type: 'user', text: 'Estaba molesto por un retraso en su pedido, aunque no era mi culpa.', date: '2025-01-05T18:04:00.000Z' },
    { type: 'assistant', text: 'Es difícil no tomarse esas cosas de manera personal, pero muchas veces la persona descarga su frustración con quien está cerca.', date: '2025-01-05T18:06:00.000Z' },
    { type: 'user', text: 'Sí, pero igual me dejó mal todo el día.', date: '2025-01-05T18:08:00.000Z' },
    { type: 'assistant', text: '¿Pudiste hablar con alguien o tomar un momento para despejarte?', date: '2025-01-05T18:10:00.000Z' },
    { type: 'user', text: 'No, tuve que seguir atendiendo gente.', date: '2025-01-05T18:12:00.000Z' },
    { type: 'assistant', text: 'Entonces es normal que la tensión se acumule. Quizás esta noche puedas hacer algo que te relaje.', date: '2025-01-05T18:14:00.000Z' },
    { type: 'user', text: 'Voy a dar un paseo después de cenar. Creo que me vendrá bien.', date: '2025-01-05T18:16:00.000Z' },
    { type: 'assistant', text: 'Muy buena idea. El movimiento y el aire fresco ayudan a despejar la mente.', date: '2025-01-05T18:18:00.000Z' },

    // 2025-01-06
    { type: 'user', text: 'Me está costando concentrarme estos días.', date: '2025-01-06T09:00:00.000Z' },
    { type: 'assistant', text: '¿Crees que es por cansancio, estrés o falta de motivación?', date: '2025-01-06T09:02:00.000Z' },
    { type: 'user', text: 'Un poco de todo. Siento que no avanzo con mis proyectos.', date: '2025-01-06T09:04:00.000Z' },
    { type: 'assistant', text: 'Tal vez podríamos dividir tus tareas en bloques más pequeños para que notes avances.', date: '2025-01-06T09:06:00.000Z' },
    { type: 'user', text: 'Eso podría ayudar. Ahora mismo todo me parece enorme.', date: '2025-01-06T09:08:00.000Z' },
    { type: 'assistant', text: 'Podemos empezar con un bloque de 25 minutos de trabajo enfocado y luego 5 minutos de descanso.', date: '2025-01-06T09:10:00.000Z' },
    { type: 'user', text: 'Sí, el método Pomodoro, lo escuché antes.', date: '2025-01-06T09:12:00.000Z' },
    { type: 'assistant', text: 'Exacto. No tiene que ser perfecto, pero es una forma de entrenar tu enfoque poco a poco.', date: '2025-01-06T09:14:00.000Z' },
    { type: 'user', text: 'Lo voy a probar ahora mismo.', date: '2025-01-06T09:16:00.000Z' },
    { type: 'assistant', text: 'Genial. Luego me cuentas cómo te fue.', date: '2025-01-06T09:18:00.000Z' },

    // 2025-01-07
    { type: 'user', text: 'No dormí bien anoche. Me desperté varias veces.', date: '2025-01-07T07:00:00.000Z' },
    { type: 'assistant', text: '¿Fue por ruido, preocupaciones o algo físico?', date: '2025-01-07T07:02:00.000Z' },
    { type: 'user', text: 'Por preocupaciones. No dejo de pensar en una decisión importante que tengo que tomar.', date: '2025-01-07T07:04:00.000Z' },
    { type: 'assistant', text: '¿Quieres contarme cuál es la decisión?', date: '2025-01-07T07:06:00.000Z' },
    { type: 'user', text: 'Es sobre si aceptar un nuevo trabajo en otra ciudad.', date: '2025-01-07T07:08:00.000Z' },
    { type: 'assistant', text: 'Entiendo, es un cambio grande. ¿Qué te atrae y qué te preocupa de la oferta?', date: '2025-01-07T07:10:00.000Z' },
    { type: 'user', text: 'Me atrae el salario y las oportunidades, pero me preocupa dejar a mi familia y amigos.', date: '2025-01-07T07:12:00.000Z' },
    { type: 'assistant', text: 'Es normal sentir ese conflicto. Tal vez podrías hacer una lista con pros y contras para verlo más claro.', date: '2025-01-07T07:14:00.000Z' },
    { type: 'user', text: 'Sí, creo que eso me ayudará a tomar una decisión más objetiva.', date: '2025-01-07T07:16:00.000Z' },
    { type: 'assistant', text: 'Y recuerda que ninguna decisión es irreversible, siempre puedes adaptarte o cambiar de rumbo más adelante.', date: '2025-01-07T07:18:00.000Z' }

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