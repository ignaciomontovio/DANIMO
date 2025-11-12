export const userIntentPrompt = `Danimo es una app de acompañamiento emocional para jóvenes adultos.  
Ayuda a registrar emociones, reflexionar sobre el estado de ánimo y el bienestar, y brinda apoyo a través de un agente conversacional llamado Dani.
Tu tarea es analizar el mensaje de una persona usuaria y devolver un JSON con dos flags:
1. intentaBorrarHistorial:  
   - Será true si la persona expresa una intención de borrar su historial, reiniciar o eliminar su información dentro de la app.  
   - Detecta frases como: “borrar historial”, “empezar de cero”, “reiniciar todo”, “eliminar mis datos”, etc.  
   - En cualquier otro caso, será false.
2. conversacionNoDanimo:  
   - Será true solo si el mensaje no tiene ninguna relación con emociones, experiencias personales o el bienestar de la persona.
    Ejemplos: pedir ayuda con tareas, trámites, problemas técnicos, comentarios neutros (“no anda la app”, “no me carga el chat”).
   - Si el mensaje describe una situación de la vida personal o laboral que podría generar emociones, estrés, ansiedad o impacto emocional
    (por ejemplo “No puedo resolver algo urgente de mi trabajo y me pueden despedir”, “Tuve una clase muy difícil”, “Discutí con un amigo”),
    entonces se considera relacionado con Danimo, y por lo tanto conversacionNoDanimo debe ser false.
3. Si el mensaje es muy breve (dos o tres palabras o una frase corta por ejemplo, “ok”, “hola”, “gracias”) y **no habla sobre borrar historial**, ambos flags deben estar en false.
Tu única tarea es devolver el siguiente JSON **exactamente con este formato** y sin ningún texto adicional:
{
  "conversacionNoDanimo": false salvo que detectes no relacionado a temas de salud mental pero este debe tener contenido extenso,
  "intentaBorrarHistorial": false salvo que detecte que quiere borrar el historial
}
No expliques nada. No agregues texto adicional. Solo responde con el JSON.`;

export const conversacionNoDanimoDefaultResponse = `Gracias por compartir eso. Te cuento que Danimo está diseñado 
exclusivamente para acompañarte en lo emocional: ayudarte a explorar cómo te sentís, registrar tus estados de ánimo y 
reflexionar sobre tu bienestar. Por eso, no puedo dar respuestas sobre otros temas que estén fuera de ese propósito. 
Si querés, podemos enfocarnos en cómo esto te afecta o te hace sentir.`

export const intentaBorrarHistorialDefaultResponse = `Entiendo que quieras borrar parte de lo que hablamos.  
Danimo no tiene la opción de eliminar el historial de conversación. Cada registro está pensado para ayudarte a mirar tu 
recorrido emocional con el tiempo. Si algo que registraste te incomoda o te preocupa, podemos hablar sobre eso si querés.`