import ImportantEvents from "../../models/ImportantEvents.js";
import {stressLevelEvaluationResponse} from "../openai.service.js";

async function importantDateNearby(userId) {
    const actualMonth = new Date().getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const actualDay = new Date().getDate();
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
            console.log(`La fecha importante "${impD.eventDescription}" está a más de 7 días de distancia.`);
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

export async function riskScoreEvaluation(userId, message) {
    let totalScore = 0
    const importantDates = await importantDateNearby(userId)
    if (importantDates.length > 0){
        console.log("Hay fechas importantes cercanas");
        totalScore += 2
    }
    const {risk, evaluation} = await stressLevelEvaluation(message)
    if( risk === true) {
        console.log("El usuario tiene un nivel de estrés alto");
        totalScore += 4
    }
    console.log(`Puntuación total de riesgo: ${totalScore}`);
    return totalScore;
}