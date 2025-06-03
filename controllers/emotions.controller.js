const { validateEmotionRegisterInput } = require('../utils/validators');
const service = require('../services/emotions.service');
const { findDailyRegisterByDateAndUser } = require('../services/registers.service');
const { getAllTypeEmotions } = require('../services/emotions.service');

exports.createEmotionRegister = async (req, res) => {
    const {error} = validateEmotionRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const { emotion, intensity, isPredominant } = req.body;
    const userId = req.userId; // asegúrate que el middleware lo setea correctamente
    const today = new Date();
    try {
        const dailyRegister = await findDailyRegisterByDateAndUser(today, userId);
        
        if (!dailyRegister) {
            return res.status(404).json({ error: 'No hay un registro diario para hoy.' });
        }

        await service.createEmotionRegister(emotion, intensity, isPredominant, dailyRegister.id);
        res.json({message: '¡Emocion registrada correctamente!'});
    } catch (err) {
        console.error('❌ Error en /emotion:', err);
        return res.status(500).json({error: 'Error al registrar emocion'});
    }
}

exports.getPredominantEmotion = async (req, res) => {
    const userId = req.userId;
    const today = new Date();

    try {
        const dailyRegister = await findDailyRegisterByDateAndUser(today, userId);

        if (!dailyRegister) {
            return res.status(404).json({ error: 'No hay un registro diario para hoy.' });
        }

        const predominantEmotion = await service.findPredominantEmotion(dailyRegister.id);

        if (!predominantEmotion) {
            return res.status(404).json({ error: 'No hay una emoción predominante registrada para hoy.' });
        }

        return res.json({message: 'Emocion predominante',emotion: predominantEmotion});
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
        console.error('❌ Error al obtener actividades:', err);
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};