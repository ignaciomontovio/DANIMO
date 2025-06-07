import Medications from '../models/Medications.js';
import { v4 as uuidv4 } from 'uuid';

export async function createMedication({ userId, startDate, endDate, name, dosage }) {
    await Medications.create({
        userId,
        startDate,
        endDate,
        name,
        dosage
    });
}