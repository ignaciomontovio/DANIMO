import SleepRegisters from '../models/SleepRegisters.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSleepRegister({ userId, bedtime, wake }) {
    const dateObj = new Date(); // fecha actual
    const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    const hoursOfSleep = (new Date(wake) - new Date(bedtime)) / (1000 * 60 * 60);

    await SleepRegisters.create({
        id: `U-${uuidv4()}`,
        userId,
        hoursOfSleep,
        date
    });
}

export async function findSleepRegisterByUserAndDate(userId, date) {
    return await SleepRegisters.findOne({ where: { userId, date } });
}

export async function getSleepRegistersByUser(userId) {
    return await SleepRegisters.findAll({
        where: { userId },
        order: [['date', 'DESC']]
    });
}
