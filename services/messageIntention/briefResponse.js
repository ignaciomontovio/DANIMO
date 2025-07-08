import { cleanMessage } from '../../utils/textNormalize.js';
import UsersEmotionalState from "../../models/UsersEmotionalState.js";

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

export async function briefResponseCooldown(userId) {
    const briefResponses = await UsersEmotionalState.findAll({where: {briefResponse: true, userId: userId}})
    console.log(briefResponses)
    return briefResponses.some( br => {
        const now = new Date();
        const diff = now - br.date;
        const diffInMinutes = Math.floor(diff / (1000 * 60));
        console.log(`Diferencia en minutos desde la última respuesta breve: ${diffInMinutes}`);
        return diffInMinutes < 30; // 30 minutos de cooldown
    })
}