import { cleanMessage } from '../../utils/textNormalize.js';

export function moodAlternatorDetected(text) {
    const cleaned = cleanMessage(text);

    const moodGroups = [
        // Necesidades básicas
        ['corte', 'agua'],
        ['corte', 'luz'],
        ['corte', 'gas'],
        ['sin', 'agua'],
        ['sin', 'luz'],
        ['sin', 'gas'],
        ['problema', 'internet'],
        ['sin', 'internet'],
        ['problema', 'vivienda'],
        ['me', 'echaron'],
        ['no', 'tengo', 'casa'],

        // Laborales
        ['mi', 'jefe', 'me', 'grito'],
        ['compañero', 'toxica'],
        ['salario', 'bajo'],
        ['no', 'aguanto', 'trabajo'],
        ['condiciones', 'laborales', 'malas'],
        ['horario', 'agotador'],
        ['estres', 'trabajo'],
        ['me', 'despidieron'],
        ['no', 'me', 'pagan'],

        // Económicos
        ['no', 'llego', 'fin', 'mes'],
        ['problema', 'plata'],
        ['no', 'tengo', 'dinero'],
        ['deuda', 'grande'],

        // Estudio (nuevo)
        ['bulling', 'escuela'],
        ['bullying', 'escuela'],
        ['bullying', 'colegio'],
        ['me', 'molestan', 'clase'],
        ['compañeros', 'molestan'],
        ['estres', 'examen'],
        ['estres', 'facultad'],
        ['estres', 'estudio'],
        ['odio', 'escuela'],
        ['odio', 'facultad'],
        ['profesor', 'insulto'],
        ['no', 'rindo', 'examen'],
        ['ansiedad', 'estudio'],
        ['preocupado', 'examen'],
        ['tarea', 'mucho'],
        ['trabajo', 'practico'],
        ['no', 'entiendo', 'clase'],
        ['me', 'burlan', 'escuela'],
        ['me', 'burlan', 'colegio'],
        ['mal', 'colegio']
    ];

    /*
    const climaticWords = new Set([
        'lluvia', 'llueve', 'tormenta', 'frio', 'calor', 'viento', 'nieve', 'granizo', 'humedad'
    ]);
    */

    const seasonalWords = new Set([
        'invierno', 'primavera', 'verano', 'otoño',
        'invernal', 'primaveral', 'veraniego', 'otoñal'
    ]);

    const words = cleaned.split(/\s+/);

    const foundInGroups = moodGroups.some(group =>
        group.every(word => cleaned.includes(word))
    );

    //const foundClimatic = words.some(word => climaticWords.has(word));
    const foundSeasonal = words.some(word => seasonalWords.has(word));

    //return foundInGroups || foundClimatic || foundSeasonal;
    return foundInGroups || foundSeasonal;
}