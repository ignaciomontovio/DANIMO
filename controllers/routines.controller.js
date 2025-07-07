import * as service from '../services/routines.service.js';

export const obtainRoutines = async (req, res) => {
  const userId = req.userId; //viene del middleware
    try {
        const routines = await service.getRoutinesByUserId(userId);
        console.log(`✅ Rutinas obtenidas exitosamente para ${userId}`);
        res.json(routines);
    } catch (err) {
        console.error('❌ Error al obtener rutinas:', err.message);
        console.error(`❌ Error en /routines/obtain para ${userId}:`, err.message);
        res.status(400).json({ error: err.message });
    }
};
