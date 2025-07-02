import { cleanMessage } from '../../utils/textNormalize.js';

export function briefResponse(text) {
    const cleaned = cleanMessage(text);
    const words = cleaned.split(/\s+/);

    const briefWords = [
        'ok', 'bien', 'normal', 'meh', 'supongo',
        'da igual', 'lo mismo', 'igual', 'nada', 'nuevo', 'todo', 'si', 'no', 'se', 'mas', 'menos',
        'que', 'mal'
    ];

    const briefPhrases = [
        ['todo', 'bien'],
        ['mas', 'o', 'menos'],
        ['igual', 'que', 'siempre'],
        ['como', 'siempre'],
        ['ni', 'bien', 'ni', 'mal'],
        ['lo', 'mismo'],
        ['nada', 'nuevo']
    ];

    const wordMatch = words.some(word => briefWords.includes(word));
    const phraseMatch = briefPhrases.some(phrase =>
        phrase.every(p => words.includes(p))
    );
    console.log("phase size " + cleaned.length)
    return (wordMatch || phraseMatch) && cleaned.length < 20;
}
