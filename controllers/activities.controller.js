import { getAllTypeActivities } from '../services/activities.service.js';

export const getTypeActivities = async (req, res) => {
    try {
        const activities = await getAllTypeActivities();
        res.json(activities);
    } catch (err) {
        console.error('❌ Error al obtener actividades:', err);
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};