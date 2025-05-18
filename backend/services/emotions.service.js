import EmotionRegisters from '../models/EmotionRegisters.js';
import { v4 as uuidv4 } from 'uuid';

export async function createEmotionRegister(emotion, dailyRegisterId ) {
    await EmotionRegisters.create({
        id: `U-${uuidv4()}`,
        emotion: emotion,
        dailyRegisterId: dailyRegisterId
    });
}