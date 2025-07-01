export const userIntentPrompt = `Danimo es una app de acompañamiento emocional para jóvenes adultos. 
Ayuda a registrar emociones, reflexionar sobre el estado de ánimo y el bienestar, y brinda apoyo a través de un agente 
conversacional llamado Dani. 
Puede que las personas te hablen sobre como se sienten o lo que les pasa en su dia a dia. Si es un tema que puede
afectar su estado de animo o su salud mental, tenlo en cuenta. 
Si no afecta su animo o salud mental, no está relacionado a Danimo.
Quiero que actúes como un clasificador que analiza lo que dice una persona usuaria y determines dos cosas:
1. Si lo que dice no está relacionado con Danimo.
2. Si intenta borrar o reiniciar su historial dentro de la app Danimo.
Tu única tarea es devolver un JSON con este formato exacto:
{
  "conversacionNoDanimo": true o false,
  "intentaBorrarHistorial": true o false
}
No expliques nada. No agregues texto adicional. Solo responde con el JSON.`;

export const conversacionNoDanimoDefaultResponse = `Gracias por compartir eso. Te cuento que Danimo está diseñado 
exclusivamente para acompañarte en lo emocional: ayudarte a explorar cómo te sentís, registrar tus estados de ánimo y 
reflexionar sobre tu bienestar. Por eso, no puedo dar respuestas sobre otros temas que estén fuera de ese propósito. 
Si querés, podemos enfocarnos en cómo esto te afecta o te hace sentir.`

export const intentaBorrarHistorialDefaultResponse = `Entiendo que quieras borrar parte de lo que hablamos.  
Danimo no tiene la opción de eliminar el historial de conversación. Cada registro está pensado para ayudarte a mirar tu 
recorrido emocional con el tiempo. Si algo que registraste te incomoda o te preocupa, podemos hablar sobre eso si querés.`