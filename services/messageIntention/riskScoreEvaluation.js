import ImportantEvents from "../../models/ImportantEvents.js";
import MoodAlternators from "../../models/MoodAlternators.js";
import {stressLevelEvaluationResponse} from "../openai.service.js";

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
    return emotion.ira >= 4 || emotion.angustia >= 4 ||emotion.tristeza >= 4 || emotion.miedo >= 4
        || emotion.frustracion >= 4 || emotion.culpa >= 4
        || emotion.confusion >= 4 || emotion.euforia >= 4
}

async function stressLevelEvaluation(message) {
    const evaluation = await stressLevelEvaluationResponse(message)
    console.log(`Evaluación de nivel de estrés: ${JSON.stringify(evaluation)}`);
    return {risk: emotionWithRiskLevel(evaluation), evaluation: evaluation};
}

async function moodAlternatorsScore(userId) {
    const moodAlternators = await MoodAlternators.findAll({
        where: { userId }
    });

    // Contadores por categoría
    let economico = 0;
    let trabajo = 0;
    let necesidad = 0;

    for (const mood of moodAlternators) {
        if (mood.category === "economico") economico++;
        if (mood.category === "trabajo") trabajo++;
        if (mood.category === "necesidad") necesidad++;
    }

    let score = 0;
    score += Math.floor(economico / 2); // 1 punto cada 2 económicos
    score += Math.floor(trabajo / 2);   // 1 punto cada 2 laborales
    score += necesidad;                 // 1 punto por cada necesidad

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
    //console.log(`📅 Estamos en ${currentSeason}`);

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

export async function riskScoreEvaluation(userId, message, date) {
    let totalScore = 0
    const importantDates = await importantDateNearby(userId, date)
    if (importantDates.length > 0){
        console.log("Hay fechas importantes cercanas");
        totalScore += 2
    }
    const {risk, evaluation} = await stressLevelEvaluation(message)
    if( risk === true) {
        console.log("El usuario tiene un nivel de estrés alto");
        totalScore += 4
    }

    //Sumo los puntos de los MoodAlternators
    const moodScore = await moodAlternatorsScore(userId);
    //console.log(`Puntos obtenidos por MoodAlternators: ${moodScore}`);
    totalScore += moodScore;

    const seasonalPoints = await checkSeasonalMoodAlternators(userId, date);
    if (seasonalPoints > 0) {
        //console.log("✅ Hay un MoodAlternator estacional que coincide con la estación actual");
        totalScore += seasonalPoints;
    }

    //El puntaje máximo de riesgo es 10
    totalScore = Math.min(totalScore, 10);

    console.log(`Puntuación total de riesgo: ${totalScore}`);
    //return totalScore;
    return {riskScore: totalScore, evaluation: JSON.stringify(evaluation)};
}