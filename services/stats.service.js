import EmotionRegisters from '../models/EmotionRegisters.js';
import { Op, Sequelize } from 'sequelize';
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";
import ActivityRegisters from "../models/ActivityRegisters.js";

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
        const start = new Date(since);
        start.setHours(0, 0, 0, 0);

        const end = new Date(until);
        end.setHours(23, 59, 59, 999);

        where.date = { [Op.between]: [start, end] };
    }

    console.log("🔍 WHERE usado en stats:", where);

    const results = await ActivityRegisters.findAll({
        where,
        attributes: [
            'activityName',
            [Sequelize.fn('COUNT', Sequelize.col('activityName')), 'count']
        ],
        group: ['ActivityRegisters.activityName'] // 👈 nombre calificado
    });

    const total = results.reduce((sum, r) => sum + parseInt(r.get('count')), 0);

    return results.map(r => ({
        activityName: r.get('activityName'),
        percentage: total > 0 
            ? (parseInt(r.get('count')) / total * 100).toFixed(2) 
            : "0.00"
    }));
}