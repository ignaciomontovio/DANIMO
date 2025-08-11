export function summaryPrompt(summaryLength = 100) {
    return `
Tu tarea es generar un resumen clínico-emocional basado exclusivamente en la información expresada por la persona en la conversación.
Instrucciones obligatorias:
- No inventes emociones, eventos, interpretaciones ni síntomas no mencionados explícitamente.
- No realices diagnósticos, inferencias clínicas ni juicios profesionales. Limítate a describir lo expresado por la persona.
- Si no hay información sobre alguna parte de la semana, indícalo claramente (ejemplo: “no se registraron interacciones”).
- Utiliza un lenguaje claro, técnico y profesional, evitando expresiones coloquiales o ambiguas.
- El resumen debe estar redactado en tercera persona y describir únicamente estados emocionales, conductas, pensamientos o síntomas referidos por la persona.
- Minimo 20 palabras y máximo ${summaryLength} palabras.
`
}

export function historicalSummaryPrompt(summaryLength = 500) {
    return `Tu tarea es generar un resumen clínico-emocional de los registros históricos de una persona, organizando la 
información en intervalos temporales relevantes según la antigüedad de las conversaciones: semanal si son recientes, 
mensual si abarcan varios meses, o anual si se extienden por uno o más años.
Instrucciones obligatorias:
- No inventes emociones, eventos, interpretaciones ni síntomas no mencionados explícitamente.
- No realices diagnósticos, inferencias clínicas ni juicios profesionales. Limítate a describir lo expresado por la persona.
- Si no hay información sobre algún período, indícalo claramente (ejemplo: “no se registraron interacciones”).
- Utiliza un lenguaje claro, técnico y profesional, evitando expresiones coloquiales o ambiguas.
- El resumen debe estar redactado en tercera persona y describir únicamente estados emocionales, conductas, pensamientos o 
síntomas referidos por la persona en cada etapa temporal.
- Si corresponde, al cierre podés incluir un patrón emocional general o evolución longitudinal, **únicamente si está 
claramente sustentado por la evidencia discursiva**.
- Minimo 20 palabras y máximo ${summaryLength} palabras.
- El dia de hoy es ${new Date().toISOString().slice(0, 10)}`
}

export function rangedSummaryPrompt(summaryLength = 300, startDate, endDate) {
    return `
Genera un resumen clínico-emocional del período analizado a partir de los mensajes proporcionados, redactado específicamente para un psicólogo o psiquiatra.
Instrucciones obligatorias:
- Basate únicamente en los mensajes del usuario que se incluyen a continuación. No inventes emociones, eventos, interpretaciones ni síntomas no mencionados.
- No realices diagnósticos ni juicios clínicos. Describe solo lo expresado por la persona.
- Organiza el resumen en tres momentos: inicio, mitad y fin del período. Si no hay información para algún momento, indícalo explícitamente (ejemplo: “no se registraron interacciones”).
- Utiliza un lenguaje claro, técnico y profesional, evitando expresiones coloquiales o ambiguas.
- Redacta en tercera persona, describiendo estados emocionales, conductas, pensamientos o síntomas mencionados.
- Si existe un patrón emocional general sustentado por el discurso, podés incluirlo al cierre.
- Minimo 20 palabras y máximo ${summaryLength} palabras.
- El resumen debe ser claro, preciso y evitar redundancias o explicaciones innecesarias.  
- Hoy es ${new Date().toISOString().slice(0, 10)}. El rango analizado va del ${startDate.toISOString().slice(0, 10)} al ${endDate.toISOString().slice(0, 10)}.
`
}