import EmotionRegisters from '../models/EmotionRegisters.js';
import { v4 as uuidv4 } from 'uuid';
import TypeEmotions from '../models/TypeEmotions.js';
import { Op } from 'sequelize';
import TypeActivities from '../models/TypeActivities.js';
import Photos from '../models/Photos.js';
import { detectEmotion } from '../recognition/recognition.js'; // 👈 importá la función

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

    let photoId = null;

    // ✅ Si viene la foto como string base64, procesamos con detectEmotion
    if (photo && typeof photo === 'string') {
        // Ejecutar reconocimiento
        const detected = await detectEmotion(photo);

        // Si devuelve Neutral → null, sino usamos la emoción detectada
        const detectedEmotion = detected;
        console.log("Emocion detectada: " + detectedEmotion);

        const photoInstance = await Photos.create({
            id: `P-${uuidv4()}`,
            image: photo,
            emotionName: detectedEmotion
        });

        photoId = photoInstance.id;
    }

    // 1. Creamos el registro sin las actividades todavía
    const register = await EmotionRegisters.create({
        id: `EM-${uuidv4()}`,
        emotionName: emotion,
        isPredominant,
        photoId: photoId,
        date: new Date(),
        userId
    });

    let activitiesArray;

    try {
        activitiesArray = Array.isArray(activities) ? activities : JSON.parse(activities);
    } catch (err) {
        console.error("No se pudo parsear activities:", activities);
        activitiesArray = [];
    }

    if (activitiesArray.length > 0) {
        const activityRecords = await TypeActivities.findAll({
            where: {
                name: { [Op.in]: activitiesArray }
            }
        });

        await register.addActivities(activityRecords);
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

export async function getEmotionRegistersByUser(userId) {
    return await EmotionRegisters.findAll({
        where: { userId },
        include: [
            {
                model: TypeActivities,
                as: 'activities',
                through: { attributes: [] }, // evita mostrar la tabla intermedia
                attributes: ['name']         // solo devuelve el nombre de la actividad
            },
            {
                model: Photos,
                as: 'photo',
                attributes: ['image', 'emotionName'] // opcional, si quieres incluir foto
            }
        ],
        order: [['date', 'DESC']]
    });
}
