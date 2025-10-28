// sleeps.controller.js

import { validateSleepRegisterInput } from '../utils/validators.js';
import * as service from '../services/sleeps.service.js';

export const createSleepRegister = async (req, res) => {
    const { error } = validateSleepRegisterInput(req.body);
    if (error) {
        console.error("❌ Error en validación Joi:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    let { hoursOfSleep, sleep, date } = req.body;
    const userId = req.userId;

    try {
        //Puede tener varios registros de sueño en un mismo dia. Despues borrar esto
        /*
        const existing = await service.findSleepRegisterByUserAndDate(userId, today);
        if (existing) {
            console.warn(`⚠️ Registro ya existe para userId=${userId} en fecha=${today}`);
            return res.status(409).json({ error: 'Ya existe un registro de sueño para hoy.' });
        }
        */
        if(date == null){
            console.warn(`⚠️ Fecha no proporcionada, se usará la fecha actual para userId=${userId}`);
            date = new Date().toISOString();
        }
        await service.createSleepRegister({ userId, hoursOfSleep, sleep, date });

        console.log(`✅ Sueño registrado correctamente para userId=${userId} para el dia ${date.toString()}`);
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

export const getTypeSleeps = async (req, res) => {
    try {
        const sleeps = await service.getAllTypeSleeps();
        console.log(`✅ ${sleeps.length} emociones obtenidas`);
        res.json(sleeps);
    } catch (err) {
        console.error('❌ Error al obtener emociones:', err);
        res.status(500).json({ error: 'Error al obtener emociones' });
    }
};