import Medications from '../models/Medications.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export async function createMedication({ userId, startDate, endDate, name, dosage }) {
    await Medications.create({
        userId,
        startDate,
        endDate,
        name,
        dosage,
        active: true
    });
}

export async function getActiveMedicationsByUser(userId) {
    return await Medications.findAll({
        where: {
            userId
        },
        order: [
            ['active', 'DESC'],       // Primero los que tienen active = true
            ['startDate', 'DESC']     // Luego por fecha de inicio descendente
        ]
    });
}

export async function getMedicationDetailByName(userId, name) {
    return await Medications.findOne({
        where: {
            userId,
            name
        }
    });
}

export async function deactivateFinishedMedications() {
    const today = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD

    try {
        const [updatedCount] = await Medications.update(
            { active: false },
            {
                where: {
                    active: true,
                    endDate: {
                        [Op.lte]: today
                    }
                }
            }
        );

        console.log(`🟡 ${updatedCount} medicaciones fueron desactivadas automáticamente por fecha.`);
    } catch (error) {
        console.error('❌ Error al desactivar medicaciones finalizadas:', error);
    }
}

export async function editMedication(userId, currentName, updates) {
    // Buscamos el registro existente
    const medication = await Medications.findOne({ where: { userId, name: currentName } });
    if (!medication) return null;

    const originalStart = medication.startDate;
    const originalEnd = medication.endDate;

    // Validar fechas si se cambian
    const newStart = updates.startDate ? new Date(updates.startDate) : originalStart;
    const newEnd = updates.endDate ? new Date(updates.endDate) : originalEnd;

    if (newStart > newEnd) {
        console.error('❌ La fecha de inicio no puede ser posterior a la fecha de fin.');
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
    }

    // Preparamos campos a actualizar
    Object.assign(medication, updates);

    // Campo active a true automáticamente
    medication.active = true;

    await medication.save();
    return medication;
}

export async function softDeleteMedication({ userId, name }) {
    const today = new Date();

    const medication = await Medications.findOne({ where: { userId, name } });
    if (!medication) {
        console.error(`❌ Medicacion ${name} no encontrada para el usuario.`);
        throw new Error(`Medicación ${name} no encontrada para el usuario.`);
    }

    await medication.update({
        active: false,
        endDate: today
    });

    return medication;
}

export const getMedicationsByUserOrdered = async (userId) => {
    return await Medications.findAll({
        where: { userId },
        order: [
            ['active', 'DESC'],  // Activas primero
            ['name', 'ASC']      // Luego orden alfabético opcional
        ]
    });
};