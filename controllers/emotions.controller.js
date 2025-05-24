const { validateEmotionRegisterInput } = require('../utils/validators');
const service = require('../services/emotions.service');
const { findDailyRegisterByDateAndUser } = require('../services/registers.service');

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