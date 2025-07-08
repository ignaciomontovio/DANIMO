import * as service from '../services/routines.service.js';
import { validateRoutineCreationInput, validateRoutineEditInput, validateRoutineDeleteInput } from '../utils/validators.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';
import TypeEmotions from '../models/TypeEmotions.js';

export const obtainRoutines = async (req, res) => {
  const userId = req.userId; //viene del middleware
    try {
        const routines = await service.getRoutinesByUserId(userId);
        console.log(`✅ Rutinas obtenidas exitosamente para ${userId}`);
        res.json(routines);
    } catch (err) {
        console.error(`❌ Error en /routines/obtain para ${userId}:`, err.message);
        res.status(400).json({ error: err.message });
    }
};

export const createRoutine = async (req, res) => {
    const { error } = validateRoutineCreationInput(req.body);
    if (error) {
        console.warn('⚠️ Validación fallida en createRoutine:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, body, emotion: emotionNumber } = req.body;
    const userId = req.userId;

    try {
        const isProfessional = await Professionals.findOne({ where: { id: userId } });

        if (!isProfessional) {
            console.warn(`⛔ El userId ${userId} no pertenece a un profesional`);
            return res.status(403).json({ error: 'Solo los profesionales pueden crear rutinas' });
        }

        const emotion = await TypeEmotions.findOne({ where: { number: emotionNumber } });

        if (!emotion) {
            console.warn(`❌ No se encontró emoción con número=${emotionNumber}`);
            return res.status(404).json({ error: `No se encontró una emoción con el número ${emotionNumber}` });
        }

        const result = await service.createRoutine({ name, body, emotion: emotion.name, createdBy: userId });
        console.log(`✅ Rutina creada correctamente por ${userId}: ${name}`);
        res.status(200).json({ message: result });
    } catch (err) {
        console.error('❌ Error al crear rutina:', err.message);
        res.status(500).json({ error: 'Error al crear rutina' });
    }
};

export const updateRoutine = async (req, res) => {
    const { error } = validateRoutineEditInput(req.body);
    if (error) {
        console.warn('⚠️ Validación fallida en updateRoutine:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { currentName, name, body, emotion: emotionNumber } = req.body;
    const userId = req.userId;

    try {
        const professional = await Professionals.findOne({ where: { id: userId } });
        if (!professional) {
            console.warn(`⛔ El userId ${userId} no pertenece a un profesional`);
            return res.status(403).json({ error: 'Solo los profesionales pueden editar rutinas' });
        }

        let emotionName = null;
        if (emotionNumber !== undefined) {
            const emotion = await TypeEmotions.findOne({ where: { number: emotionNumber } });
            if (!emotion) {
                return res.status(404).json({ error: `No se encontró una emoción con el número ${emotionNumber}` });
            }
            emotionName = emotion.name;
        }

        const result = await service.updateRoutine({
            currentName,
            name,
            body,
            emotionName,
            userId
        });

        console.log(`✅ Rutina "${currentName}" actualizada correctamente por ${userId}`);
        res.status(200).json({ message: result });

    } catch (err) {
        console.error('❌ Error al actualizar rutina:', err.message);
        res.status(400).json({ error: err.message });
    }
};

export const deleteRoutine = async (req, res) => {
    const { error } = validateRoutineDeleteInput(req.body);
    if (error) {
        console.warn('⚠️ Validación fallida en deleteRoutine:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name } = req.body;
    const userId = req.userId;

    try {
        const isProfessional = await Professionals.findOne({ where: { id: userId } });
        if (!isProfessional) {
            console.warn(`⛔ El userId ${userId} no pertenece a un profesional`);
            return res.status(403).json({ error: 'Solo los profesionales pueden borrar rutinas' });
        }

        const result = await service.deleteRoutine(name, userId);
        console.log(`🗑️ Rutina eliminada: ${name} por profesional ${userId}`);
        res.status(200).json({ message: result });

    } catch (err) {
        console.error('❌ Error al eliminar rutina:', err.message);
        res.status(400).json({ error: err.message });
    }
};