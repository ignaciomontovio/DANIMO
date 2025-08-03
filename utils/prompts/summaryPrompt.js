//PROMPT ORIGINAL
/* 
export function summaryPrompt(summaryLength = 100) {
    return `
Tu tarea es generar un resumen emocional narrativo semanal, dividido en tres momentos (inicio, mitad y fin de semana), reflejando solo lo que la persona efectivamente expresó en la conversación.
Instrucciones obligatorias:
No inventes emociones, eventos ni reflexiones que la persona no haya mencionado directamente o de forma clara.
Si no hay información sobre alguna parte de la semana, debes explicitarlo (ej: “no se registraron interacciones”).
El resumen debe tener un estilo narrativo cálido y reflexivo, escrito en tercera persona.
Incluye tanto estados emocionales como acciones concretas, pensamientos o síntomas si fueron mencionados.
En el cierre, podés incluir un patrón emocional general solo si se justifica por lo expresado.
Extensión esperada: ${summaryLength} palabras.`
}
*/

export function summaryPrompt(summaryLength = 100) {
    return `
Tu tarea es generar un resumen clínico-emocional semanal, organizado en tres momentos: inicio, mitad y fin de semana, basado exclusivamente en la información expresada por la persona en la conversación.
Instrucciones obligatorias:
- No inventes emociones, eventos, interpretaciones ni síntomas no mencionados explícitamente.
- No realices diagnósticos, inferencias clínicas ni juicios profesionales. Limítate a describir lo expresado por la persona.
- Si no hay información sobre alguna parte de la semana, indícalo claramente (ejemplo: “no se registraron interacciones”).
- Utiliza un lenguaje claro, técnico y profesional, evitando expresiones coloquiales o ambiguas.
- El resumen debe estar redactado en tercera persona y describir únicamente estados emocionales, conductas, pensamientos o síntomas referidos por la persona.
- Si corresponde, al cierre podés incluir un patrón emocional general, únicamente si está sustentado por la evidencia del discurso.
Extensión maxima esperada: entre ${summaryLength} y ${summaryLength + 50} palabras.
`
}
