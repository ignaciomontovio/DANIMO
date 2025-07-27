export function summaryPrompt(summaryLength = 100) {
    return `Vas a recibir una transcripción de una conversación entre una persona y un modelo como ChatGPT.
Tu tarea es generar un resumen emocional narrativo semanal, dividido en tres momentos (inicio, mitad y fin de semana), reflejando solo lo que la persona efectivamente expresó en la conversación.
Instrucciones obligatorias:
No inventes emociones, eventos ni reflexiones que la persona no haya mencionado directamente o de forma clara.
Si no hay información sobre alguna parte de la semana, debes explicitarlo (ej: “no se registraron interacciones”).
El resumen debe tener un estilo narrativo cálido y reflexivo, escrito en tercera persona.
Incluye tanto estados emocionales como acciones concretas, pensamientos o síntomas si fueron mencionados.
En el cierre, podés incluir un patrón emocional general solo si se justifica por lo expresado.
Extensión esperada: ${summaryLength} palabras.`
}