import SleepRegisters from '../models/SleepRegisters.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSleepRegister(hoursOfSleep, quality, dailyRegisterId ) {
    await SleepRegisters.create({
        id: `U-${uuidv4()}`,
        hoursOfSleep: hoursOfSleep,
        quality,
        dailyRegisterId: dailyRegisterId
    });
}