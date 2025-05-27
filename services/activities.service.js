import ActivityRegisters from '../models/ActivityRegisters.js';
import { v4 as uuidv4 } from 'uuid';
import TypeActivities from '../models/TypeActivities.js';

export async function createActivityRegister(name, category, date, dailyRegisterId) {
    await ActivityRegisters.create({
        id: `U-${uuidv4()}`,
        name: name,
        category: category,
        date: date,
        dailyRegisterId: dailyRegisterId,
    });
}

export async function getAllTypeActivities() {
    return await TypeActivities.findAll();
}