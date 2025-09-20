import { validateEmotionRegisterInput } from '../utils/validators.js';
import * as service from '../services/emotions.service.js';
import TypeEmotions from '../models/TypeEmotions.js';


export const createEmotionRegister = async (req, res) => {
    const { error, values } = validateEmotionRegisterInput(req.body);
    if (error) {
        console.warn('⚠️ Validación fallida en createEmotionRegister:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    console.log(`RECIBIDO:
        emotionNumber: ${req.body.emotion}
        isPredominant: ${req.body.isPredominant}
        activities: ${req.body.activities}
        date: ${values.date}
    `)

    const { emotion: emotionNumber, isPredominant, activities, photo } = req.body;
    const userId = req.userId;

    try {
        // Buscá la emoción por número
        const emotionData = await TypeEmotions.findOne({ where: { number: emotionNumber } });

        if (!emotionData) {
            console.warn(`❌ No se encontró emoción para número=${emotionNumber}`);
            return res.status(404).json({ error: `No se encontró una emoción con el número ${emotionNumber}` });
        }

        const emotionName = emotionData.name;

        let photo = null;
        if (req.file) {
            const mimeType = req.file.mimetype; // ej: 'image/png'
            const base64 = req.file.buffer.toString('base64');
            photo = `data:${mimeType};base64,${base64}`;
        }

        await service.createEmotionRegister({ userId, emotion: emotionName, isPredominant, activities, photo, date: values.date });
        console.log(`✅ Emoción registrada: { userId: ${userId}, emotion: ${emotionName}, predominant: ${isPredominant} }`);
        res.json({ message: '¡Emoción registrada correctamente!' });

    } catch (err) {
        console.error('❌ Error en /entry:', err);
        return res.status(500).json({ error: 'Error al registrar emoción' });
    }
};

export const getPredominantEmotion = async (req, res) => {
    const userId = req.userId;
    const date = new Date();

    try {
        const predominantEmotion = await service.findPredominantEmotion({ userId, date });

        if (!predominantEmotion) {
            console.log(`ℹ️ No hay emoción predominante registrada para hoy para userId=${userId}`);
            return res.json({ message: 'No hay una emoción predominante registrada para hoy.', emotion: null });
        }

        console.log(`✅ Emoción predominante encontrada: ${predominantEmotion}`);
        return res.json({ message: 'Emoción predominante', emotion: predominantEmotion });
    } catch (err) {
        console.error('❌ Error en /predominant:', err);
        return res.status(500).json({ error: 'Error al obtener la emoción predominante' });
    }
};

export const getTypeEmotions = async (req, res) => {
    try {
        const emotions = await service.getAllTypeEmotions();
        console.log(`✅ ${emotions.length} emociones obtenidas`);
        res.json(emotions);
    } catch (err) {
        console.error('❌ Error al obtener emociones:', err);
        res.status(500).json({ error: 'Error al obtener emociones' });
    }
};

export const getAllEmotionRegisters = async (req, res) => {
    const userId = req.userId;

    try {
        const registers = await service.getEmotionRegistersByUser(userId);

        console.log(`✅ ${registers.length} registros de emocion encontrados para userId=${userId}`);
        res.json({ message: 'Registros de emociones obtenidos con éxito', data: registers });
    } catch (err) {
        console.error('❌ Error en /obtain:', err);
        res.status(500).json({ error: 'Error al obtener los registros de emociones' });
    }
};
