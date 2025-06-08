const { cleanMessage } = require('../../utils/textNormalize');

export function containsDateReference(text) {
    const cleaned = cleanMessage(text);
    const words = cleaned.split(/\s+/);

    // Palabras individuales
    const temporalWords = [
        'hoy', 'manana', 'ayer', 'pasado', 'anteayer', 'anoche',
        'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo',
        'semana', 'viene', 'pasada', 'mes', 'ano', 'rato', 'tarde', 'pronto',
        'navidad', 'nuevo', 'santa', 'verano', 'invierno', 'primavera', 'otoño',
        'cumpleanos', 'finde',
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
        'fecha', 'agenda', 'cita', 'calendario', 'evento', 'recordatorio'
    ];

    // Frases compuestas (como arrays de palabras)
    const temporalPhrases = [
        ['proxima', 'semana'],
        ['semana', 'que', 'viene'],
        ['semana', 'pasada'],
        ['mes', 'pasado'],
        ['mes', 'que', 'viene'],
        ['ano', 'pasado'],
        ['proximo', 'ano'],
        ['fin', 'de', 'semana'],
        ['quiero', 'agendar'],
        ['recordar', 'cita'],
    ];

    const wordMatch = words.some(word => temporalWords.includes(word));

    const phraseMatch = temporalPhrases.some(phrase =>
        phrase.every(p => words.includes(p))
    );

    const regexMatch = [
        /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,     // 01/06/2025 o 1-6-25
        /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/,       // 2025-06-01
        /\b\d{1,2}\s+de\s+[a-z]+(?:\s+de\s+\d{4})?\b/, // 1 de junio, 1 de junio de 2025
        /\b[a-z]+\s+\d{1,2}(?:,\s*\d{4})?\b/          // junio 1, junio 1, 2025
    ].some(regex => regex.test(cleaned));

    return wordMatch || phraseMatch || regexMatch;
}
