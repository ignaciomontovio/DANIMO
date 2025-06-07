import SleepRegisters from '../models/SleepRegisters.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSleepRegister({ userId, hoursOfSleep, date }) {
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