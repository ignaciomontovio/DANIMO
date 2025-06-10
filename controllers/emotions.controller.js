const { validateEmotionRegisterInput } = require('../utils/validators');
const service = require('../services/emotions.service');
const { getAllTypeEmotions } = require('../services/emotions.service');

exports.createEmotionRegister = async (req, res) => {
    const { error } = validateEmotionRegisterInput(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { emotion, isPredominant, activities, photo } = req.body;
    const userId = req.userId;
    const date = new Date();

    try {
        await service.createEmotionRegister({ userId, emotion, isPredominant, activities, photo, date });
        res.json({ message: '¡Emoción registrada correctamente!' });
    } catch (err) {
        console.error('❌ Error en /entry:', err);
        return res.status(500).json({ error: 'Error al registrar emoción' });
    }
};

exports.getPredominantEmotion = async (req, res) => {
    const userId = req.userId;
    const date = new Date();

    try {
        const predominantEmotion = await service.findPredominantEmotion({ userId, date });

        if (!predominantEmotion) {
            return res.status(404).json({ error: 'No hay una emoción predominante registrada para hoy.' });
        }

        return res.json({ message: 'Emoción predominante', emotion: predominantEmotion });
    } catch (err) {
        console.error('❌ Error en /predominant:', err);
        return res.status(500).json({ error: 'Error al obtener la emoción predominante' });
    }
};

exports.getTypeEmotions = async (req, res) => {
    try {
        const emotions = await getAllTypeEmotions();
        res.json(emotions);
    } catch (err) {
        console.error('❌ Error al obtener emociones:', err);
        res.status(500).json({ error: 'Error al obtener emociones' });
    }
};

exports.getAllEmotionRegisters = async (req, res) => {
    const userId = req.userId;

    try {
        const registers = await service.getEmotionRegistersByUser(userId);

        res.json({ message: 'Registros de emociones obtenidos con éxito', data: registers });
    } catch (err) {
        console.error('❌ Error en /obtain:', err);
        res.status(500).json({ error: 'Error al obtener los registros de emociones' });
    }
};
