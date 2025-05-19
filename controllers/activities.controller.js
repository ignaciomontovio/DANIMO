const { validateActivityRegisterInput } = require('../utils/validators');
const service = require('../services/activities.service');

exports.createActivityRegister = async (req, res) => {
    const {error} = validateActivityRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const { name, category, date, dailyRegisterId } = req.body;
    console.log(date)
    try {
        await service.createActivityRegister(name, category, date, dailyRegisterId);
        res.json({message: '¡Actividad registrada correctamente!'});
    } catch (err) {
        console.error('❌ Error en /sleep:', err);
        return res.status(500).json({error: 'Error al registrar actividad'});
    }
}