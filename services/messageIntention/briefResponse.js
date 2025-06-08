const {cleanMessage} = require('../../utils/textNormalize');

export function briefResponse(message) {
    const cleanText = cleanMessage(message)

    const briefExpressions = [
        'ok', 'bien', 'todo bien', 'normal', 'no se', 'mas o menos',
        'meh', 'igual que siempre', 'como siempre', 'da igual',
        'ni bien ni mal', 'supongo', 'lo mismo', 'nada nuevo'
    ];

    // Detecta si el mensaje completo coincide con alguna expresión escueta
    return briefExpressions.some((frase) =>
        cleanText === frase || cleanText.includes(frase)
    ) &&  cleanText.length < 20;
}