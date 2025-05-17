const { validateDailyRegisterInput } = require('../utils/validators');
const service = require('../services/registers.service');


exports.createDailyRegister = async (req, res) => {
    const {error} = validateDailyRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        await service.createDailyRegister(req.body);
        res.json({message: '¡Registro diario creado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /daily:', err);
        return res.status(500).json({error: 'Error al cargar registro diario'});
    }
}