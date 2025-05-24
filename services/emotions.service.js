import EmotionRegisters from '../models/EmotionRegisters.js';
import { v4 as uuidv4 } from 'uuid';

export async function createEmotionRegister(emotion, intensity, isPredominant ,dailyRegisterId ) {
    await EmotionRegisters.create({
        id: `U-${uuidv4()}`,
        emotion: emotion,
        intensity: intensity,
        isPredominant: isPredominant,
        dailyRegisterId: dailyRegisterId
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