import EmotionRegisters from '../models/EmotionRegisters.js';
import { Op, fn, col, Sequelize } from 'sequelize';
import ImportantEvents from "../models/ImportantEvents.js";
import MoodAlternators from "../models/MoodAlternators.js";
import ActivityRegisters from "../models/ActivityRegisters.js";
import SleepRegisters from "../models/SleepRegisters.js";
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

    const hobbies = [];
    const activities = [];

    results.forEach(r => {
        const count = parseInt(r.get('count'));
        const activity = {
            activityName: r.get('activityName'),
            count
        };

        if (r.get('category') === 'Hobby') {
            hobbies.push(activity);
        } else {
            activities.push(activity);
        }
    });

    // Ordenar de mayor a menor (por cantidad)
    hobbies.sort((a, b) => b.count - a.count);
    activities.sort((a, b) => b.count - a.count);

    return { hobbies, activities };
}

export async function getSleepsStatsForUser(userId, since, until) {
    const where = { userId };

    if (since && until) {
        where.date = { [Op.between]: [new Date(since), new Date(until)] };
    }

    const results = await SleepRegisters.findAll({
        where,
        attributes: [
        'sleepName',
        [fn('COUNT', col('sleepName')), 'count']
        ],
        group: ['sleepName'],
        order: [[fn('COUNT', col('sleepName')), 'DESC']]
    });

    return results.map(r => ({
        sleepName: r.sleepName,
        count: r.dataValues.count
    }));
}