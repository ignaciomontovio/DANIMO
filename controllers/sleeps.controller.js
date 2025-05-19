const { validateSleepRegisterInput } = require('../utils/validators');
const service = require('../services/sleeps.service');

exports.createSleepRegister = async (req, res) => {
    const {error} = validateSleepRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const { hoursOfSleep, nightmares, dailyRegisterId } = req.body;
    try {
        await service.createSleepRegister(hoursOfSleep, nightmares, dailyRegisterId);
        res.json({message: '¡Sueño registrado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /sleep:', err);
        return res.status(500).json({error: 'Error al registrar sueño'});
    }
}