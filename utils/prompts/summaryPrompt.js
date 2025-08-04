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

export function historicalSummaryPrompt(summaryLength = 500) {
    return `
Tu tarea es generar un resumen clínico-emocional de los registros históricos de una persona, organizando la información en intervalos temporales relevantes según la antigüedad de las conversaciones: semanal si son recientes, mensual si abarcan varios meses, o anual si se extienden por uno o más años.

Instrucciones obligatorias:
- No inventes emociones, eventos, interpretaciones ni síntomas no mencionados explícitamente.
- No realices diagnósticos, inferencias clínicas ni juicios profesionales. Limítate a describir lo expresado por la persona.
- Si no hay información sobre algún período, indícalo claramente (ejemplo: “no se registraron interacciones”).
- Utiliza un lenguaje claro, técnico y profesional, evitando expresiones coloquiales o ambiguas.
- El resumen debe estar redactado en tercera persona y describir únicamente estados emocionales, conductas, pensamientos o síntomas referidos por la persona en cada etapa temporal.
- Si corresponde, al cierre podés incluir un patrón emocional general o evolución longitudinal, **únicamente si está claramente sustentado por la evidencia discursiva**.

Extensión máxima esperada ${summaryLength} palabras.
`
}