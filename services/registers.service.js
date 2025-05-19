import DailyRegisters from '../models/DailyRegisters.js';
import { Op } from 'sequelize';
//const DailyRegisters = require('../models/DailyRegisters');
//const { v4: uuidv4 } = require('uuid');

import { v4 as uuidv4 } from 'uuid';

const findDailyRegisterByDateAndUser = async (date, userId) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await DailyRegisters.findOne({
        where: {
            userId,
            date: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }
    });
};

export async function createDailyRegister(date, userId ) {
    const dailyRegister = await findDailyRegisterByDateAndUser(date, userId)
    console.log(dailyRegister)
    if(dailyRegister) throw new Error('Ya hay un registro para este usuario y fecha.');

    await DailyRegisters.create({
        id: `U-${uuidv4()}`,
        date: date,
        userId: userId
    });
}