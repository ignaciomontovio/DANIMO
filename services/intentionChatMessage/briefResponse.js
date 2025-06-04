function cleanText(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function briefResponse(texto) {
    const cleanText = cleanText(
        texto.toLowerCase().replace(/[^\w\s]/g, '').trim()
    );

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