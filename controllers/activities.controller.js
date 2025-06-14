//const { findDailyRegisterByDateAndUser } = require('../services/registers.service');
const { getAllTypeActivities } = require('../services/activities.service');

exports.getTypeActivities = async (req, res) => {
    try {
        const activities = await getAllTypeActivities();
        res.json(activities);
    } catch (err) {
        console.error('❌ Error al obtener actividades:', err);
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};