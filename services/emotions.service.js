import EmotionRegisters from '../models/EmotionRegisters.js';
import { v4 as uuidv4 } from 'uuid';
import TypeEmotions from '../models/TypeEmotions.js';
import { Op } from 'sequelize';
import TypeActivities from '../models/TypeActivities.js';

export async function createEmotionRegister({ userId, emotion, isPredominant, activities, photo, date }) {
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));

    if (isPredominant) {
        const existing = await EmotionRegisters.findOne({
            where: {
                userId,
                isPredominant: true,
                date: {
                    [Op.between]: [todayStart, todayEnd]
                }
            }
        });

        if (existing) {
            await existing.update({ isPredominant: false });
        }
    }

    // 1. Creamos el registro sin las actividades todavía
    const register = await EmotionRegisters.create({
        id: `U-${uuidv4()}`,
        emotionName: emotion,
        isPredominant,
        photoId: photo?.id || null,
        date: new Date(),
        userId
    });

    // 2. Buscamos las actividades por nombre
    if (activities && activities.length > 0) {
        const activityRecords = await TypeActivities.findAll({
            where: {
                name: {
                    [Op.in]: activities
                }
            }
        });

        // 3. Relacionamos las actividades al registro creado
        await register.addActivities(activityRecords); // 👈 aquí se llena la tabla intermedia
    }

    return register;
}

export async function findPredominantEmotion({ userId, date }) {
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));

    return await EmotionRegisters.findOne({
        where: {
            userId,
            isPredominant: true,
            date: {
                [Op.between]: [todayStart, todayEnd]
            }
        }
    });
}

export async function getAllTypeEmotions() {
    return await TypeEmotions.findAll();
}
