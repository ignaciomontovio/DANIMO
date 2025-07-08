import Routines from '../models/Routines.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';
import { v4 as uuidv4 } from 'uuid';

export async function getRoutinesByUserId(userId) {
  // Verificar si el ID pertenece a un usuario
    const isUser = await Users.findByPk(userId);
    if (isUser) {
    // Usuario común: solo ve las creadas por system por ahora
        console.log(`📦 Devolver rutinas a usuario`);
        return await Routines.findAll({ where: { createdBy: 'system' } });
    }

    const isProfessional = await Professionals.findByPk(userId);
    if (isProfessional) {
    // Profesional: ve las del sistema + propias
        console.log(`📦 Devolver rutinas a profesional`);
        return await Routines.findAll({
            where: {
            createdBy: [ 'system', userId ]
            }
        });
    }

    console.error(`❌ ID ${userId} no corresponde a un usuario ni a un profesional`);
    throw new Error('ID inválido: no corresponde a un usuario ni a un profesional');
}

export async function createRoutine({ name, body, emotion, createdBy }) {
    const existing = await Routines.findOne({
        where: {
            name
        }
    });

    if (existing) {
        throw new Error(`Ya existe una rutina llamada "${name}".`);
    }

    await Routines.create({
        id: uuidv4(),
        name,
        body,
        emotion,
        createdBy
    });

    return '¡Rutina creada correctamente!';
}

export async function updateRoutine({ currentName, name, body, emotionName, userId }) {
    const routine = await Routines.findOne({ where: { name: currentName, createdBy: userId } });

    if (!routine) {
        throw new Error('No se encontró una rutina con ese nombre que pertenezca al profesional.');
    }

    if (name && name !== currentName) {
        const duplicate = await Routines.findOne({ where: { name, createdBy: userId } });
        if (duplicate) {
            throw new Error(`Ya existe una rutina con el nombre "${name}" para este profesional.`);
        }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (body) updateFields.body = body;
    if (emotionName) updateFields.emotion = emotionName;

    await routine.update(updateFields);

    return 'Rutina actualizada correctamente';
}