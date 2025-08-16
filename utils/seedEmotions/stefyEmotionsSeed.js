// utils/seedEmotions/stefyEmotionsSeed.js
import { v4 as uuidv4 } from 'uuid';
import EmotionRegisters from '../../models/EmotionRegisters.js';
import Users from '../../models/Users.js';

const stefyEmail = 'stefaniavioliali97@gmail.com';

const fechas = [
    new Date('2025-07-27'),
    new Date('2025-07-28'),
    new Date('2025-07-29'),
    new Date('2025-07-30'),
    new Date('2025-07-31'),
    new Date('2025-08-01'),
    new Date('2025-08-02')
];

const emociones = ['Alegria', 'Ansiedad', 'Enojo', 'Miedo', 'Tristeza'];

export default async function seedStefyEmotions() {
    const stefy = await Users.findOne({ where: { email: stefyEmail } });
    if (!stefy) return;

    for (let i = 0; i < fechas.length; i++) {
        const fecha = fechas[i];
        for (let j = 0; j < emociones.length; j++) {
            const emotionName = emociones[j];
            const isPredominant = j === i % emociones.length;

            // Evita duplicados
            const exists = await EmotionRegisters.findOne({
                where: {
                    userId: stefy.id,
                    emotionName,
                    date: fecha
                }
            });
            if (!exists) {
                await EmotionRegisters.create({
                    id: `EM-${uuidv4()}`,
                    userId: stefy.id,
                    emotionName,
                    isPredominant,
                    date: fecha
                });
            }
        }
    }
}