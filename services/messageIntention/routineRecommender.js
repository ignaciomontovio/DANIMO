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