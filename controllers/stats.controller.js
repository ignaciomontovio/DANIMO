import * as service from '../services/stats.service.js';
import { validateStatsEmotionsInput, validateMonthStatsInput, validateStatsYearInput, 
    validateStatsActivitiesInput, validateImportantEventsInput } from '../utils/validators.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';

export const getImportantEvents = async (req, res) => {
    const { error, value } = validateImportantEventsInput(req.body);
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/important-events:`, error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const isProfessional = await Professionals.findByPk(req.userId);

        if (!isProfessional) {
            return res.status(403).json({ error: 'Esta ruta solo esta disponible para profesionales autorizados.' });
        }
        const user = await Users.findByPk(value.userId);

        if (!user) {
            return res.status(400).json({ error: 'El userId proporcionado no corresponde a un usuario válido.' });
        }

        const importantDates = await service.getImportantEventsForUser(value.userId);
        console.log(`Fechas importantes devueltas para el usuario ${value.userId}`);
        return res.status(200).json(importantDates);
    } catch (err) {
        console.error(`❌ Error al obtener fechas importantes:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}


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

export const getWeeklyEmotions = async (req, res) => {
    const requesterId = req.userId; // viene del middleware
    const { userId: bodyUserId } = req.body;

    try {
        const isUser = await Users.findByPk(requesterId);
        const isProfessional = await Professionals.findByPk(requesterId);

        if (!isUser && !isProfessional) {
            return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        // Determinar el usuario objetivo
        let targetUserId;
        if (isUser) {
            targetUserId = requesterId;
        } else if (isProfessional) {
            if (!bodyUserId) {
                return res.status(400).json({ error: 'Falta el userId del paciente a consultar.' });
            }
            targetUserId = bodyUserId;
        }

        // Calcular rango de fechas
        const until = new Date(); // ahora
        const since = new Date();
        since.setDate(until.getDate() - 7);

        const stats = await service.getEmotionStatsForUser(targetUserId, since, until);

        console.log(`📊 Emociones de la semana para el usuario ${targetUserId}`);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error en /stats/week:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getEmotionsMonth = async (req, res) => {
    const authUserId = req.userId;
    const { userId, month, year } = req.body;

    const { error } = validateMonthStatsInput(req.body);
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/month:`, error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const isUser = await Users.findByPk(authUserId);
        const isProfessional = await Professionals.findByPk(authUserId);

        if (!isUser && !isProfessional) {
        return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        const targetUserId = isUser ? authUserId : userId;
        if (isProfessional && !userId) {
        return res.status(400).json({ error: 'Falta el userId del usuario a consultar.' });
        }

        // Calcular primer y último día del mes
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // último día del mes

        const stats = await service.getPredominantEmotionStatsForUser(targetUserId, startDate, endDate);
        console.log(`Emociones del mes ${month}/${year} para usuario ${targetUserId}`);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error al obtener estadísticas mensuales:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getYearStats = async (req, res) => {
    const authUserId = req.userId; // viene del middleware
    const { userId, year } = req.body;

    // Validación con Joi
    const { error } = validateStatsYearInput({ userId, year });
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/year:`, error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Verifico si es User o Professional
        const isUser = await Users.findByPk(authUserId);
        const isProfessional = await Professionals.findByPk(authUserId);

        if (!isUser && !isProfessional) {
            return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        const targetUserId = isUser ? authUserId : userId;
        if (isProfessional && !userId) {
            return res.status(400).json({ error: 'Falta el userId del usuario a consultar.' });
        }

        // Si no viene year, uso el actual
        const targetYear = year || new Date().getFullYear();

        // Primer y último día del año
        const since = new Date(targetYear, 0, 1); // 1 de enero
        const until = new Date(targetYear, 11, 31, 23, 59, 59); // 31 de diciembre

        // Llamo al servicio
        const stats = await service.getPredominantEmotionStatsForUser(targetUserId, since, until);
        console.log(`📊 Emociones devueltas para el usuario ${targetUserId} en el año ${targetYear}`);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error en /stats/year:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getActivitiesStats = async (req, res) => {
    const userId = req.userId;
    const { id, since, until } = req.body;

    const { error } = validateStatsActivitiesInput({ id, since, until });
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/activities:`, error.details[0].message);
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

        const stats = await service.getActivitiesStatsForUser(targetUserId, since, until);
        console.log(`📊 Actividades devueltas para el usuario ${targetUserId}`);
        console.log(stats);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error al obtener estadísticas de actividades:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getWeeklyActivities = async (req, res) => {
    const requesterId = req.userId; // viene del middleware
    const { userId: bodyUserId } = req.body;

    try {
        const isUser = await Users.findByPk(requesterId);
        const isProfessional = await Professionals.findByPk(requesterId);

        if (!isUser && !isProfessional) {
            return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        // Determinar el usuario objetivo
        let targetUserId;
        if (isUser) {
            targetUserId = requesterId;
        } else if (isProfessional) {
            if (!bodyUserId) {
                return res.status(400).json({ error: 'Falta el userId del paciente a consultar.' });
            }
            targetUserId = bodyUserId;
        }

        // Calcular rango de fechas (últimos 7 días)
        const today = new Date();

        // Hasta fin del día actual (sin perder registros por milisegundos)
        const until = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        until.setMilliseconds(-1);  // Esto da 23:59:59.999 del día actual

        // Desde hace 7 días, al inicio exacto
        const since = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        const stats = await service.getActivitiesStatsForUser(targetUserId, since, until);

        console.log(`📊 Actividades de la semana para el usuario ${targetUserId}`);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error en /stats/activities/week:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getActivitiesMonth = async (req, res) => {
    const authUserId = req.userId;
    const { userId, month, year } = req.body;

    // Validación igual que emociones
    const { error } = validateMonthStatsInput(req.body);
    if (error) {
        console.warn(`⚠️ Validación fallida en /stats/activities/month:`, error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const isUser = await Users.findByPk(authUserId);
        const isProfessional = await Professionals.findByPk(authUserId);

        if (!isUser && !isProfessional) {
            return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        // Determinar el usuario objetivo
        const targetUserId = isUser ? authUserId : userId;
        if (isProfessional && !userId) {
            return res.status(400).json({ error: 'Falta el userId del usuario a consultar.' });
        }

        // ✅ Primer día del mes
        const startDate = new Date(year, month - 1, 1);
        startDate.setHours(0, 0, 0, 0);

        // ✅ Último día del mes
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);

        const stats = await service.getActivitiesStatsForUser(targetUserId, startDate, endDate);

        console.log(`📊 Actividades del mes ${month}/${year} para usuario ${targetUserId}`);
        return res.status(200).json(stats);
    } catch (err) {
        console.error(`❌ Error al obtener estadísticas mensuales de actividades:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getWeeklySleeps = async (req, res) => {
    const requesterId = req.userId; // viene del middleware
    const { userId: bodyUserId } = req.body;

    try {
        const isUser = await Users.findByPk(requesterId);
        const isProfessional = await Professionals.findByPk(requesterId);

        if (!isUser && !isProfessional) {
            return res.status(403).json({ error: 'Usuario no autorizado.' });
        }

        // Determinar el usuario objetivo
        let targetUserId;
        if (isUser) {
            targetUserId = requesterId;
        } else if (isProfessional) {
            if (!bodyUserId) {
                return res.status(400).json({ error: 'Falta el userId del paciente a consultar.' });
            }
            targetUserId = bodyUserId;
        }

        // Calcular rango de fechas (últimos 7 días)
        const today = new Date();

        // Hasta fin del día actual (sin perder registros por milisegundos)
        const until = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        until.setMilliseconds(-1);  // Esto da 23:59:59.999 del día actual

        // Desde hace 7 días, al inicio exacto
        const since = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        const sleeps = await service.getSleepsStatsForUser(targetUserId, since, until);

        console.log(`📊 Registros de sueño de la semana para el usuario ${targetUserId}`);
        return res.status(200).json(sleeps);
    } catch (err) {
        console.error(`❌ Error en /stats/sleeps-week:`, err.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};