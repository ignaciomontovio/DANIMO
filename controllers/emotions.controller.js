const { validateEmotionRegisterInput } = require('../utils/validators');
const service = require('../services/emotions.service');

exports.createEmotionRegister = async (req, res) => {
    const {error} = validateEmotionRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const { emotion, dailyRegisterId } = req.body;
    try {
        await service.createEmotionRegister(emotion, dailyRegisterId);
        res.json({message: '¡Emocion registrada correctamente!'});
    } catch (err) {
        console.error('❌ Error en /emotion:', err);
        return res.status(500).json({error: 'Error al registrar emocion'});
    }
}