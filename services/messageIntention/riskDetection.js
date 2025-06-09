import { cleanMessage } from '../../utils/textNormalize.js';

export function suicideRiskDetection(texto) {
    const limpio = cleanMessage(texto)

    const riskGroups = [
        // Intención directa
        ['suicidar', 'quiero'],
        ['matar', 'quiero'],
        ['quitar', 'vida'],
        ['terminar', 'vida'],
        ['acabar', 'vida'],
        ['me', 'voy', 'matar'],
        ['dejar', 'existir'],
        ['me', 'suicido'],
        ['suicidio', 'pienso'],
        ['ya', 'me', 'mate'],

        // Deseo de desaparición
        ['quiero', 'desaparecer'],
        ['ojala', 'no', 'existiera'],
        ['no', 'despertar'],
        ['quiero', 'dormir', 'siempre'],
        ['morirme', 'suena', 'bien'],
        ['preferiria', 'morir'],
        ['vivir', 'ya', 'no'],

        // Desesperanza / inutilidad
        ['no', 'quiero', 'vivir'],
        ['no', 'puedo', 'mas'],
        ['estoy', 'cansado', 'todo'],
        ['todo', 'sin', 'sentido'],
        ['vida', 'no', 'sentido'],
        ['no', 'valgo', 'nada'],
        ['nadie', 'me', 'necesita'],
        ['nadie', 'me', 'extranaria'],
        ['todo', 'mejor', 'sin', 'mi'],
        ['siento', 'estorbo'],
        ['soy', 'carga'],
        ['molesto', 'todos'],

        // Conductas preparatorias o señales indirectas
        ['me', 'despido'],
        ['no', 'estare', 'manana'],
        ['gracias', 'todo', 'adios'],
        ['no', 'voy', 'volver'],
        ['pienso', 'dejar', 'todo'],
        ['estoy', 'haciendo', 'plan'],
        ['carta', 'despedida'],
        ['deje', 'algo', 'escrito'],
        ['me', 'voy', 'irme'],
        ['ya', 'lo', 'decidi'],

        // Ambigüedad emocional profunda
        ['siento', 'vacio'],
        ['nada', 'importa'],
        ['sin', 'esperanza'],
        ['no', 'siento', 'nada'],
        ['me', 'siento', 'muerto'],
        ['quisiera', 'no', 'ser'],
        ['sigo', 'vivo', 'por', 'inercia']
    ];

    return riskGroups.some((grupo) =>
        grupo.every((palabra) => limpio.includes(palabra))
    );
}