const { validateActivityRegisterInput } = require('../utils/validators');
const service = require('../services/activities.service');
//const { findDailyRegisterByDateAndUser } = require('../services/registers.service');
const { getAllTypeActivities } = require('../services/activities.service');

exports.createActivityRegister = async (req, res) => {
    const {error} = validateActivityRegisterInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const { name, category, date } = req.body;
    const userId = req.userId; // asegúrate que el middleware lo setea correctamente
    const today = new Date();

    try {
        const dailyRegister = await findDailyRegisterByDateAndUser(today, userId);

        if (!dailyRegister) {
            return res.status(404).json({ error: 'No hay un registro diario para hoy.' });
        }

        await service.createActivityRegister(name, category, date, dailyRegister.id);
        res.json({message: '¡Actividad registrada correctamente!'});
    } catch (err) {
        console.error('❌ Error en /sleep:', err);
        return res.status(500).json({error: 'Error al registrar actividad'});
    }
}

exports.getTypeActivities = async (req, res) => {
    try {
        const activities = await getAllTypeActivities();
        res.json(activities);
    } catch (err) {
        console.error('❌ Error al obtener actividades:', err);
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};