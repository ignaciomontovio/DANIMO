// sleeps.controller.js

import { validateSleepRegisterInput } from '../utils/validators.js';
import * as service from '../services/sleeps.service.js';

export const createSleepRegister = async (req, res) => {
    const { error } = validateSleepRegisterInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
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
            console.warn(`⚠️ Registro de sueño ya existente para userId=${userId} en fecha=${date}`);
            return res.status(409).json({ error: 'Ya existe un registro de sueño para hoy.' });
        }

        await service.createSleepRegister({ userId, hoursOfSleep, date });
        console.log("✅ Sueño registrado correctamente para el usuario " + userId)
        res.json({ message: '¡Sueño registrado correctamente!' });
    } catch (err) {
        console.error('❌ Error en createSleepRegister:', err);
        return res.status(500).json({ error: 'Error al registrar sueño' });
    }
};

export const getAllSleepRegisters = async (req, res) => {
    const userId = req.userId;
    try {
        const registers = await service.getSleepRegistersByUser(userId);
        console.log("✅ Los registros de sueño han sido devueltos correctamente para el usuario " + userId)
        res.json({ message: 'Registros de sueño obtenidos con éxito', data: registers });
    } catch (err) {
        console.error('❌ Error en /obtain (sueño):', err);
        res.status(500).json({ error: 'Error al obtener los registros de sueño' });
    }
};
