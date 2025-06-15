import Medications from '../models/Medications.js';
import { v4 as uuidv4 } from 'uuid';

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
            userId,
            active: true
        },
        attributes: ['name'], // Solo queremos el nombre
        order: [['startDate', 'DESC']] // Opcional: ordenarlos por fecha de inicio
    });
}
