import Routines from '../models/Routines.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';

export async function getRoutinesByUserId(userId) {
  // Verificar si el ID pertenece a un usuario
    const isUser = await Users.findByPk(userId);
    if (isUser) {
    // Usuario común: solo ve las creadas por system por ahora
        console.log(`📦 Devolver rutinas a usuario`);
        return await Routines.findAll({ where: { createdBy: 'system' } });
    }

    const isProfessional = await Professionals.findByPk(userId);
    if (isProfessional) {
    // Profesional: ve las del sistema + propias
        console.log(`📦 Devolver rutinas a profesional`);
        return await Routines.findAll({
            where: {
            createdBy: [ 'system', userId ]
            }
        });
    }

    console.error(`❌ ID ${userId} no corresponde a un usuario ni a un profesional`);
    throw new Error('ID inválido: no corresponde a un usuario ni a un profesional');
}
