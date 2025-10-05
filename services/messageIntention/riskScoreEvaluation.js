import ImportantEvents from "../../models/ImportantEvents.js";
import MoodAlternators from "../../models/MoodAlternators.js";
import {stressLevelEvaluationResponse} from "../openai.service.js";
import { Op } from "sequelize";
import UsersEmotionalState from "../../models/UsersEmotionalState.js";
import SleepRegisters from "../../models/SleepRegisters.js";

async function importantDateNearby(userId, date) {
    const actualMonth = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const actualDay = date.getDate();
    const importantDates = await ImportantEvents.findAll({
        where: {
            userId
        }
    });
    return importantDates.map(impD => {
        // date1 y date2 son objetos Date
        const date1 = impD.eventDate
        const d1 = new Date(2000, date1.getMonth(), date1.getDate());
        const d2 = new Date(2000, actualMonth, actualDay);
        const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24); // Diferencia en días
        if (diff <= 7) {
            console.log(`¡Atención! La fecha importante "${impD.eventDescription}" está a ${diff} días de distancia.`);
            return true
        } else {
            return false
        }
    })
}

function emotionWithRiskLevel(emotion) {
    const highRisk = 
        emotion.ira >= 4 || emotion.angustia >= 4 || emotion.tristeza >= 4 || emotion.miedo >= 4 ||
        emotion.frustracion >= 4 || emotion.culpa >= 4 ||
        emotion.confusion >= 4 || emotion.euforia >= 4;

    if (highRisk) return true;

    // Nueva lógica: si 3 o más emociones están en nivel 3 o más devuelvo true
    const emotions = [
        emotion.ira, emotion.angustia, emotion.tristeza, emotion.miedo,
        emotion.frustracion, emotion.culpa, emotion.confusion, emotion.euforia
    ];

    const countLevel3 = emotions.filter(value => value >= 3).length;

    return countLevel3 >= 3;
}

async function stressLevelEvaluation(message) {
    const evaluation = await stressLevelEvaluationResponse(message)
    console.log(`Evaluación de nivel de estrés: ${JSON.stringify(evaluation)}`);
    return {risk: emotionWithRiskLevel(evaluation), evaluation: evaluation};
}

async function moodAlternatorsScore(userId) {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const moodAlternators = await MoodAlternators.findAll({
        where: { 
            userId,
            date: { [Op.gte]: fifteenDaysAgo } // solo los últimos 15 días
        }
    });

    // Contadores por categoría
    let economico = 0;
    let trabajo = 0;
    let necesidad = 0;
    let estudio = 0;

    for (const mood of moodAlternators) {
        if (mood.category === "economico") economico++;
        if (mood.category === "trabajo") trabajo++;
        if (mood.category === "necesidad") necesidad++;
        if (mood.category === "estudio") estudio++;
    }

    let score = 0;
     // ✅ Económico: máx 2 puntos
    if (economico >= 4) {
        score += 2;
    } else if (economico >= 2) {
        score += 1;
    }

    // ✅ Trabajo: máx 1 punto
    if (trabajo >= 2) {
        score += 1;
    }

    // ✅ Estudio: máx 1 punto
    if (estudio >= 2) {
        score += 1;
    }

    // ✅ Necesidad: igual que antes
    score += necesidad;

    return score;
}

//Obtengo la estacion actual
function getSeason(date) {
    const year = date.getFullYear();
    const day = new Date(year, date.getMonth(), date.getDate());

  const winterStart = new Date(year, 5, 21); // 21/6
  const springStart = new Date(year, 8, 21); // 21/9
  const summerStart = new Date(year, 11, 21); // 21/12
  const autumnStart = new Date(year, 2, 21); // 21/3

    if (day >= winterStart && day < springStart) {
        return "invierno";
    }
    if (day >= springStart && day < summerStart) {
        return "primavera";
    }
    if (day >= summerStart || day < autumnStart) {
        return "verano";
    }
    return "otoño";
}

//Busco modificadores de animo para la estacion actual
async function checkSeasonalMoodAlternators(userId, date) {
    const currentSeason = getSeason(date);
    console.log(`📅 Estamos en ${currentSeason}`);

    const moods = await MoodAlternators.findAll({
        where: { userId, category: "estacional" }
    });

    const seasonKeywords = {
        invierno: ["invierno", "invernal"],
        primavera: ["primavera", "primaveral"],
        verano: ["verano", "estival"],
        otoño: ["otoño", "otoñal"]
    };

    // Pasamos descriptions a minúsculas y verificamos coincidencias
    const match = moods.some(mood =>
        seasonKeywords[currentSeason].some(keyword =>
        mood.description.toLowerCase().includes(keyword)
        )
    );

    return match ? 1 : 0;
}

// Calcular puntaje por calidad de sueño
async function sleepScore(userId, date) {
    const sevenDaysAgo = new Date(date);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const badSleepCount = await SleepRegisters.count({
        where: {
            userId,
            sleepName: { [Op.in]: ["Malo", "Muy malo"] },
            date: { [Op.gte]: sevenDaysAgo }
        }
    });

    let score = 0;
    if (badSleepCount > 6) {
        console.log("😴 Más de 6 registros de sueño 'Malo' o 'Muy malo' en la última semana → +2");
        score = 2;
    } else if (badSleepCount > 3) {
        console.log("😴 Entre 4 y 6 registros de sueño 'Malo' o 'Muy malo' en la última semana → +1");
        score = 1;
    }

    return score;
}

export async function riskScoreEvaluation(userId, message, date) {
    let totalScore = 0
    const importantDates = await importantDateNearby(userId, date)
    if (importantDates.length > 0){
        console.log("Hay fechas importantes cercanas → +2");
        totalScore += 2
    }
    const {risk, evaluation} = await stressLevelEvaluation(message)
    if( risk === true) {
        console.log("El usuario tiene un nivel de estrés alto → +5");
        totalScore += 5
    }

    //Sumo los puntos de los MoodAlternators
    const moodScore = await moodAlternatorsScore(userId);
    console.log(`Puntos obtenidos por MoodAlternators: ${moodScore}`);
    totalScore += moodScore;

    const seasonalPoints = await checkSeasonalMoodAlternators(userId, date);
    if (seasonalPoints > 0) {
        console.log("✅ Hay un MoodAlternator estacional que coincide con la estación actual → +1");
        totalScore += seasonalPoints;
    }

    // NUEVA LÓGICA con UsersEmotionalState
    const now = new Date(date);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // Intentos de suicidio
    const suicideLastWeek = await UsersEmotionalState.findOne({
        where: {
            userId,
            suicideRiskDetected: true,
            date: { [Op.gte]: sevenDaysAgo }
        }
    });

    if (suicideLastWeek) {
        console.log("⚠️ Intento de suicidio en la última semana → +2");
        totalScore += 2;
    } else {
        const suicidePrevWeek = await UsersEmotionalState.findOne({
            where: {
                userId,
                suicideRiskDetected: true,
                date: { [Op.between]: [fourteenDaysAgo, sevenDaysAgo] }
            }
        });
        if (suicidePrevWeek) {
            console.log("⚠️ Intento de suicidio en la semana anterior → +1");
            totalScore += 1;
        }
    }

    // Respuestas breves en la última semana (descartado)
    /*
    const briefResponsesCount = await UsersEmotionalState.count({
        where: {
            userId,
            briefResponseDetected: true,
            date: { [Op.gte]: sevenDaysAgo }
        }
    });

    if (briefResponsesCount > 20) {
        console.log("⚠️ Más de 20 respuestas breves en la última semana → +2");
        totalScore += 2;
    } else if (briefResponsesCount > 10) {
        console.log("⚠️ Más de 10 respuestas breves en la última semana → +1");
        totalScore += 1;
    }
    */

    // Rutinas recomendadas en la última semana (descartado)
    /*
    const routinesCount = await UsersEmotionalState.count({
        where: {
            userId,
            routineRecomended: true,
            date: { [Op.gte]: sevenDaysAgo }
        }
    });

    if (routinesCount >= 7) {
        console.log("⚠️ Más de 7 rutinas recomendadas en la última semana → +1");
        totalScore += 1;
    }
    */

    // Puntaje de sueño
    const sleepPoints = await sleepScore(userId, date);
    totalScore += sleepPoints;

    //El puntaje máximo de riesgo es 10
    totalScore = Math.min(totalScore, 10);

    console.log(`Puntuación total de riesgo: ${totalScore}`);
    //return totalScore;
    return {riskScore: totalScore, evaluation: JSON.stringify(evaluation)};
}