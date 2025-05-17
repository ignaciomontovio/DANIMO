import DailyRegisters from '../models/DailyRegisters.js';

//const DailyRegisters = require('../models/DailyRegisters');
//const { v4: uuidv4 } = require('uuid');

import { v4 as uuidv4 } from 'uuid';


export async function createDailyRegister(date, email, userId ) {
    await DailyRegisters.create({
        id: `U-${uuidv4()}`,
        date: date,
        userId: userId
    });
}