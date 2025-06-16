import SleepRegisters from '../models/SleepRegisters.js';
import { v4 as uuidv4 } from 'uuid';
import TypeSleeps from '../models/TypeSleeps.js';

export async function createSleepRegister({ userId, bedtime, wake, sleep }) {
    const dateObj = new Date();
    const date = dateObj.toISOString().split('T')[0];
    const hoursOfSleep = (new Date(wake) - new Date(bedtime)) / (1000 * 60 * 60);

    const typeSleep = await TypeSleeps.findOne({ where: { number: sleep } });

    if (!typeSleep) {
        throw new Error(`No se encontró un TypeSleep con number=${sleep}`);
    }

    await SleepRegisters.create({
        id: `U-${uuidv4()}`,
        userId,
        hoursOfSleep,
        date,
        sleepName: typeSleep.name
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
