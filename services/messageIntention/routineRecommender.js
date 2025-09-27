import UsersEmotionalState from "../../models/UsersEmotionalState.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export function saveRoutineRecommended(userId, message) {
    UsersEmotionalState.create({
        id: `RUTI-${uuidv4()}`,
        userId: userId,
        message: message,
        briefResponseDetected: false,
        routineRecomended: true,
        suicideRiskDetected: false,
        date: new Date()
    });
}

export async function wasRoutineRecommendedInLast24Hours(userId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentRecommendation = await UsersEmotionalState.findOne({
        where: {
            userId,
            routineRecomended: true,
            date: {
                [Op.gt]: twentyFourHoursAgo
            }
        }
    });

    return !!recentRecommendation; // true si existe, false si no
}

//REVISAR AGREGAR MAS CATEGORIAS DE EMOCIONES
export function getPredominantEmotion(evaluation) {
    const emotionMap = {
        Tristeza: (evaluation.tristeza || 0) + (evaluation.culpa || 0),
        Miedo: evaluation.miedo || 0,
        Enojo: (evaluation.ira || 0) + (evaluation.frustracion || 0),
        Ansiedad: (evaluation.angustia || 0) + (evaluation.confusion || 0),
    };

    const sorted = Object.entries(emotionMap).sort((a, b) => b[1] - a[1]);
    const [predominantEmotion, score] = sorted[0];

    return score > 0 ? predominantEmotion : null;
}

export async function countRoutinesRecommendedToday(userId, currentDate = new Date()) {
    // inicio y fin del día actual
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const routinesCount = await UsersEmotionalState.count({
        where: {
            userId,
            routineRecomended: true,
            date: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }
    });

    return routinesCount;
}