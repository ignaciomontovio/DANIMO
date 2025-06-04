function cleanMessage(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function containsDateReference(text) {
    const cleanMessage = cleanMessage(text.toLowerCase().replace(/[^\w\s]/g, ''));

    const temporalKeywords = [
        // Referencias temporales absolutas
        'hoy', 'mañana', 'ayer', 'pasado mañana', 'anteayer', 'anoche',

        // Días de la semana (con o sin artículo)
        'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
        'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado', 'el domingo',

        // Referencias relativas
        'la próxima semana', 'la semana que viene', 'la semana pasada',
        'el mes que viene', 'el mes pasado', 'el año pasado', 'el próximo año',
        'la otra semana', 'en unos días', 'en un rato', 'más tarde', 'pronto',

        // Fiestas y temporadas comunes
        'navidad', 'año nuevo', 'semana santa', 'verano', 'invierno', 'primavera', 'otoño',
        'cumpleaños', 'fin de semana', 'finde',

        // Meses
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',

        // Palabras relacionadas a eventos temporales
        'fecha', 'agenda', 'cita', 'calendario', 'evento', 'recordatorio'
    ];

    const wordMatch = temporalKeywords.some((keyword) =>
        cleanMessage.includes(keyword)
    );

    const regexMatch = [
        // fechas numéricas típicas
        /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,     // 01/06/2025 o 1-6-25
        /\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/,       // 2025-06-01
        /\b\d{1,2}\s+de\s+[a-z]+(?:\s+de\s+\d{4})?\b/, // 1 de junio, 1 de junio de 2025
        /\b[a-z]+\s+\d{1,2}(?:,\s*\d{4})?\b/          // junio 1, junio 1, 2025
    ].some((regex) => regex.test(cleanMessage));

    return wordMatch || regexMatch;
}