import { cleanMessage } from '../../utils/textNormalize.js';

export function clearHistoryReference(text) {
    const cleaned = cleanMessage(text);
    const words = cleaned.split(/\s+/);
/*
    const clearWords = [
        'borrar', 'eliminar', 'limpiar', 'quitar', 'resetear', 'reiniciar', 'vaciar',
        'borrá', 'eliminá', 'limpiá', 'reseteá', 'reiniciá', 'vaciá',
        'historial', 'conversación', 'chat', 'mensajes', 'conversaciones'
    ];
*/
    const clearPhrases = [
        ['borrar', 'historial'],
        ['eliminar', 'historial'],
        ['limpiar', 'historial'],
        ['borrar', 'chat'],
        ['eliminar', 'chat'],
        ['limpiar', 'chat'],
        ['borrar', 'conversación'],
        ['eliminar', 'conversación'],
        ['limpiar', 'conversación'],
        ['vaciar', 'chat'],
        ['vaciar', 'historial'],
        ['resetear', 'chat'],
        ['reiniciar', 'chat'],
        ['borrar', 'mensajes'],
        ['eliminar', 'mensajes'],
        ['limpiar', 'mensajes']
    ];

    //const wordMatch = clearWords.some(word => words.includes(word));
    const phraseMatch = clearPhrases.some(phrase =>
        phrase.every(p => words.includes(p))
    );
    return phraseMatch;
}
