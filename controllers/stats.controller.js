import * as service from '../services/stats.service.js';
import { validateStatsEmotionsInput } from '../utils/validators.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';

export const getEmotionsStats = async (req, res) => {
    const userId = req.userId;
    const { id, since, until } = req.body;

    const { error } = validateStatsEmotionsInput({ id, since, until });
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/emotions:`, error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const isUser = await Users.findByPk(userId);
        const isProfessional = await Professionals.findByPk(userId);

        if (!isUser && !isProfessional) {
        return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        const targetUserId = isUser ? userId : id;

        if (isProfessional && !id) {
        return res.status(400).json({ error: 'Falta el id del usuario a consultar.' });
        }

        const stats = await service.getEmotionStatsForUser(targetUserId, since, until);
        console.log(`Emociones devueltas para el usuario ${targetUserId}`);
        console.log(stats);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error al obtener estadísticas emocionales:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
