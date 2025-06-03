import EmotionRegisters from '../models/EmotionRegisters.js';
import { v4 as uuidv4 } from 'uuid';
import TypeEmotions from '../models/TypeEmotions.js';

export async function createEmotionRegister(emotion, intensity, isPredominant, dailyRegisterId) {
    if (isPredominant) {
        // Buscar si ya hay una emoción predominante para este registro diario
        const predominantEmotion = await EmotionRegisters.findOne({
            where: {
                dailyRegisterId,
                isPredominant: true
            }
        });

        if (predominantEmotion) {
            // Si existe, desmarcarla
            await predominantEmotion.update({ isPredominant: false });
        }
    }

    // Insertar la nueva emoción
    await EmotionRegisters.create({
        id: `U-${uuidv4()}`,
        emotion,
        intensity,
        isPredominant,
        dailyRegisterId
    });
}

export async function findPredominantEmotion(dailyRegisterId) {
    return await EmotionRegisters.findOne({
        where: {
            dailyRegisterId,
            isPredominant: true
        }
    });
}

export async function getAllTypeEmotions() {
    return await TypeEmotions.findAll();
}