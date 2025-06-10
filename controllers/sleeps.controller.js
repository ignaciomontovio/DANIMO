// sleeps.controller.js

const { validateSleepRegisterInput } = require('../utils/validators');
const service = require('../services/sleeps.service');
const { findDailyRegisterByDateAndUser } = require('../services/registers.service');

exports.createSleepRegister = async (req, res) => {
    const { error } = validateSleepRegisterInput(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { bedtime, wake } = req.body;
    const userId = req.userId;

    const dateObj = new Date(); // fecha actual
    const date = dateObj.toISOString().split('T')[0]; // solo YYYY-MM-DD

    const hoursOfSleep = (new Date(wake) - new Date(bedtime)) / (1000 * 60 * 60);

    try {
        const existing = await service.findSleepRegisterByUserAndDate(userId, date);
        if (existing) {
            return res.status(409).json({ error: 'Ya existe un registro de sueño para hoy.' });
        }

        await service.createSleepRegister({ userId, hoursOfSleep, date });
        res.json({ message: '¡Sueño registrado correctamente!' });
    } catch (err) {
        console.error('❌ Error al registrar sueño:', err);
        return res.status(500).json({ error: 'Error al registrar sueño' });
    }
};

exports.getAllSleepRegisters = async (req, res) => {
    const userId = req.userId;

    try {
        const registers = await service.getSleepRegistersByUser(userId);
        res.json({ message: 'Registros de sueño obtenidos con éxito', data: registers });
    } catch (err) {
        console.error('❌ Error en /obtain (sueño):', err);
        res.status(500).json({ error: 'Error al obtener los registros de sueño' });
    }
};
