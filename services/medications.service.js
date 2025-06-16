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
            userId,
            active: true
        },
        attributes: ['name'], // Solo queremos el nombre
        order: [['startDate', 'DESC']] // Opcional: ordenarlos por fecha de inicio
    });
}

export async function getMedicationDetailByName(userId, name) {
    return await Medications.findOne({
        where: {
            userId,
            name,
            active: true
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