// utils/seedEmotions/stefyEmotionsSeed.js
import {v4 as uuidv4} from 'uuid';
import EmotionRegisters from '../../models/EmotionRegisters.js';
import Users from '../../models/Users.js';

const stefyEmail = 'stefaniavioliali97@gmail.com';

const fechas = Array.from({length: 27}, (_, i) => {
    return new Date(2025, 1, 27 + i); // Mes 1 = febrero (0-indexado)
});

const emociones = ['Alegria', 'Ansiedad', 'Enojo', 'Miedo', 'Tristeza'];

export default async function seedStefyEmotions() {
    const stefy = await Users.findOne({where: {email: stefyEmail}});
    if (!stefy) return;

    for (let i = 0; i < fechas.length; i++) {
        const fecha = fechas[i];
        const randomIndex = Math.floor(Math.random() * emociones.length);
        const emotionName = emociones[randomIndex];
        const isPredominant = true;

        // Evita duplicados
        const exists = await EmotionRegisters.findOne({
            where: {
                userId: stefy.id,
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