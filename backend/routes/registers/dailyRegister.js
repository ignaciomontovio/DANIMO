//sacar lo que no se vaya a usar
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Users = require('../../models/Users');
const DailyRegisters = require('../../models/DailyRegisters');

// === Helpers ===
const validateDailyRegisterInput = (data) => {
    const schema = Joi.object({
        date: Joi.date().required(),
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
};

const findUserIdByEmail = async (email) => {
    const user = await Users.findOne({
        where: { email },
        attributes: ['id']
    });
    return user?.id || null;
};

const createDailyRegister = async ({date, userId}) => {
    return await DailyRegisters.create({
        id: `U-${uuidv4()}`,
        date: date,
        userId: userId
    });
};

// === Rutas ===
// Registro diario de usuario
router.post('/create', async (req, res) => {
    const {error} = validateDailyRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    const {date, email} = req.body;

    try{
        const userId = await(findUserIdByEmail(email))
        if(!userId){
            return res.status(400).json({error: 'No puedo cargar registro diario. Usuario no existe.'});
        }

        await createDailyRegister({date, userId});

        res.json({message: '¡Registro diario creado correctamente!'});
    } catch(err) {
        console.error('❌ Error en /daily:', err);
        return res.status(500).json({error: 'Error al cargar registro diario'});
    }        
});

module.exports = router;