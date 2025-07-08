import Routines from '../models/Routines.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';
import { v4 as uuidv4 } from 'uuid';

export async function getRoutinesByUser(userId) {
    // ¿Es usuario o profesional?
    const isUser = await Users.findByPk(userId);
    const isProfessional = await Professionals.findByPk(userId);

    if (!isUser && !isProfessional) {
        throw new Error('El usuario no existe.');
    }

    let routines = [];

    if (isUser) {
    const user = await Users.findByPk(userId, {
        include: {
        model: Routines,
        as: 'Routines',
        through: { attributes: [] }
        }
    });

    const systemRoutines = await Routines.findAll({
        where: { createdBy: 'system' }
    });

    const assignedRoutines = user?.Routines || [];

    // Evitar duplicados por id
    const combinedMap = new Map();
    [...systemRoutines, ...assignedRoutines].forEach(r => {
        combinedMap.set(r.id, r); // usa el ID como clave para evitar repetidos
    });

    routines = Array.from(combinedMap.values());
    }

    if (isProfessional) {
        // 👨‍⚕️ Si es profesional: obtener rutinas propias y del sistema
        routines = await Routines.findAll({
        where: {
            createdBy: [userId, 'system']
        },
        include: [{
            model: Users,
            as: 'Users', // 👈 Usá el alias definido en la asociación belongsToMany
            attributes: ['email'],
            through: { attributes: [] }
        }]
        });

        // Para rutinas que no son suyas, omitimos los usuarios
        routines = routines.map(routine => {
        const json = routine.toJSON();
        if (json.createdBy !== userId) {
            delete json.Users;
        }
        return json;
        });
    }

    return routines;
}

export async function createRoutine({ name, body, emotion, createdBy }) {
    const existing = await Routines.findOne({
        where: {
            name
        }
    });

    if (existing) {
        throw new Error(`Ya existe una rutina llamada "${name}".`);
    }

    await Routines.create({
        id: uuidv4(),
        name,
        body,
        emotion,
        createdBy
    });

    return '¡Rutina creada correctamente!';
}

export async function updateRoutine({ currentName, name, body, emotionName, userId }) {
    const routine = await Routines.findOne({ where: { name: currentName, createdBy: userId } });

    if (!routine) {
        throw new Error('No se encontró una rutina con ese nombre que pertenezca al profesional.');
    }

    if (name && name !== currentName) {
        const duplicate = await Routines.findOne({ where: { name, createdBy: userId } });
        if (duplicate) {
            throw new Error(`Ya existe una rutina con el nombre "${name}" para este profesional.`);
        }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (body) updateFields.body = body;
    if (emotionName) updateFields.emotion = emotionName;

    await routine.update(updateFields);

    return 'Rutina actualizada correctamente';
}

export async function deleteRoutine(name, userId) {
    const routine = await Routines.findOne({ where: { name, createdBy: userId } });

    if (!routine) {
        throw new Error('No se encontró una rutina con ese nombre que pertenezca al profesional.');
    }

    await routine.destroy();
    return 'Rutina eliminada correctamente';
}

export async function assignRoutine(name, emails, professionalId) {
    // 1. Buscar la rutina por nombre Y por su creador
    const routine = await Routines.findOne({
        where: {
            name,
            createdBy: professionalId // 👈 Solo puede intervenir en sus propias rutinas
        }
    });

    if (!routine) {
        throw new Error(`No existe una rutina con el nombre "${name}" creada por vos.`);
    }

    // 2. Buscar todos los usuarios por email
    const users = await Users.findAll({
        where: {
            email: emails
        }
    });

    if (users.length !== emails.length) {
        const foundEmails = users.map(u => u.email);
        const notFound = emails.filter(e => !foundEmails.includes(e));
        throw new Error(`Los siguientes emails no pertenecen a ningún usuario: ${notFound.join(', ')}`);
    }

    // 3. Asignar la rutina a cada usuario usando addRoutine
    for (const user of users) {
        await user.addRoutine(routine); // Sequelize usa la tabla intermedia
    }

    return `✅ Rutina "${name}" asignada a ${users.length} usuario(s) correctamente.`;
}