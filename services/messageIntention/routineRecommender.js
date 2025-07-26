import UsersEmotionalState from "../../models/UsersEmotionalState.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Routines from "../../models/Routines.js";
import Users from "../../models/Users.js";

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

export async function getRecommendedRoutineName(userId, evaluation) {
    const predominantEmotion = getPredominantEmotion(evaluation);
    console.log(`🎯 Emoción predominante detectada: ${predominantEmotion || 'Ninguna'}`);

    // Buscamos el usuario junto con las rutinas que tenga asignadas
    const user = await Users.findByPk(userId, {
        include: {
            model: Routines,
            as: 'Routines', // 👈 asegurate que el alias coincida con la definición belongsToMany
            through: { attributes: [] }
        }
    });

    if (!user) {
        console.warn(`⚠️ Usuario con id=${userId} no encontrado`);
        return null;
    }

    // Obtenemos rutinas del sistema y rutinas asignadas
    const systemRoutines = await Routines.findAll({ where: { createdBy: 'system' } });
    const assignedRoutines = user.Routines || [];

    const allRoutines = [...systemRoutines, ...assignedRoutines];

    if (allRoutines.length === 0) {
        console.warn('⚠️ No se encontraron rutinas disponibles para el usuario');
        return null;
    }

    // Filtramos por la emoción predominante
    let filtered = [];
    if (predominantEmotion) {
        filtered = allRoutines.filter(r => r.emotion === predominantEmotion);
    }

    // Seleccionamos el conjunto base para elegir
    const selectionPool = filtered.length > 0 ? filtered : allRoutines;
    console.log(`📊 Seleccionando rutina entre ${selectionPool.length} opciones`);

    // Construimos lista ponderada: asignadas con más peso
    let weightedPool = [];
    for (const routine of selectionPool) {
        const weight = routine.createdBy === 'system' ? 1 : 3; // Asignadas pesan más
        for (let i = 0; i < weight; i++) {
            weightedPool.push(routine);
        }
    }

    // Elección aleatoria con ponderación
    const routineToRecommend = weightedPool[Math.floor(Math.random() * weightedPool.length)];

    console.log(`✅ Rutina recomendada: ${routineToRecommend.name} (prioridad aplicada)`);
    return routineToRecommend.name;
}