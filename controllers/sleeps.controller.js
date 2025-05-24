// sleeps.controller.js

const { validateSleepRegisterInput } = require('../utils/validators');
const service = require('../services/sleeps.service');
const { findDailyRegisterByDateAndUser } = require('../services/registers.service');

exports.createSleepRegister = async (req, res) => {
    const { error } = validateSleepRegisterInput(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { hoursOfSleep, nightmares } = req.body;
    const userId = req.userId; // asegúrate que el middleware lo setea correctamente
    const date = new Date();

    try {
        const dailyRegister = await findDailyRegisterByDateAndUser(date, userId);

        if (!dailyRegister) {
            return res.status(404).json({ error: 'No hay un registro diario para hoy.' });
        }

        await service.createSleepRegister(hoursOfSleep, nightmares, dailyRegister.id);
        res.json({ message: '¡Sueño registrado correctamente!' });
    } catch (err) {
        console.error('❌ Error en /sleep:', err);
        return res.status(500).json({ error: 'Error al registrar sueño' });
    }
};
