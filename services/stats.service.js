import EmotionRegisters from '../models/EmotionRegisters.js';
import { Op, Sequelize } from 'sequelize';
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";
import ActivityRegisters from "../models/ActivityRegisters.js";
import TypeActivities from '../models/TypeActivities.js';

export async function getImportantEventsForUser(userId) {
    const importantEvents = await ImportantEvents.findAll({ where: { userId} });
    const moodAlternators = await MoodAlternators.findAll({ where: { userId} });
    return { importantEvents, moodAlternators };
}


export async function getPredominantEmotionStatsForUser(userId, since, until) {
    const results = await EmotionRegisters.findAll({
        where: {
        userId,
        isPredominant: true,
        date: {
            [Op.between]: [new Date(since), new Date(until)]
        }
        },
        attributes: [
        [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
        'emotionName'
        ],
        order: [['date', 'ASC']]
    });

    return results.map(r => ({
        date: r.get('date'),
        emotionName: r.get('emotionName')
    }));
}

export async function getEmotionStatsForUser(userId, since, until) {
    const results = await EmotionRegisters.findAll({
        where: {
        userId,
        date: {
            [Op.between]: [new Date(since), new Date(until)]
        }
        },
        attributes: [
        [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
        'emotionName'
        ],
        order: [['date', 'ASC']]
    });

    return results.map(r => ({
        date: r.get('date'),
        emotionName: r.get('emotionName')
    }));
}

export async function getActivitiesStatsForUser(userId, since, until) {
    const where = { userId };
    if (since && until) {
        where.date = { [Op.between]: [new Date(since), new Date(until)] };
    }

    // Traemos registros con categoría usando un join literal
    const results = await ActivityRegisters.findAll({
        where,
        attributes: [
            'activityName',
            [Sequelize.fn('COUNT', Sequelize.col('ActivityRegisters.activityName')), 'count'],
            [
                Sequelize.literal(`(
                    SELECT category 
                    FROM "TypeActivities" 
                    WHERE "TypeActivities"."name" = "ActivityRegisters"."activityName"
                    LIMIT 1
                )`),
                'category'
            ]
        ],
        group: ['activityName']
    });

    const total = results.reduce((sum, r) => sum + parseInt(r.get('count')), 0);

    // Separar en hobbies y otras
    const hobbies = [];
    const activities = [];

    results.forEach(r => {
        const percentage = total > 0 ? (parseInt(r.get('count')) / total * 100).toFixed(2) : "0.00";
        const activity = {
            activityName: r.get('activityName'),
            percentage
        };

        if (r.get('category') === 'Hobby') {
            hobbies.push(activity);
        } else {
            activities.push(activity);
        }
    });

    // Ordenar de mayor a menor porcentaje
    hobbies.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    activities.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    return { hobbies, activities };
}