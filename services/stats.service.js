import EmotionRegisters from '../models/EmotionRegisters.js';
import { Op, Sequelize } from 'sequelize';
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";

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