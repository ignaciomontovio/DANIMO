import Routines from '../models/Routines.js';
import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';
import { v4 as uuidv4 } from 'uuid';

export async function getRoutinesByUser(userId, emotionParam = null) {
    const isUser = await Users.findByPk(userId);
    const isProfessional = await Professionals.findByPk(userId);

    if (!isUser && !isProfessional) {
        throw new Error('El usuario no existe.');
    }

    // Función auxiliar para transformar el campo emotion a array
    const transformEmotionField = (routine) => {
        const json = routine.toJSON ? routine.toJSON() : routine;
        json.emotion = json.emotion
            ? json.emotion.split(',').map(e => e.trim())
            : [];
        return json;
    };

    // Caso: Profesional (se ignora emotionParam, comportamiento original)
    if (isProfessional) {
        let routines = await Routines.findAll({
            where: { createdBy: [userId, 'system'] },
            include: [{
                model: Users,
                as: 'Users',
                attributes: ['email'],
                through: { attributes: [] }
            }]
        });

        // Ocultar info de usuarios en rutinas del sistema y transformar emociones
        routines = routines.map(routine => {
            let json = transformEmotionField(routine);
            if (json.createdBy !== userId) {
                delete json.Users;
            }
            return json;
        });

        return routines;
    }

    // Caso: Usuario
    const user = await Users.findByPk(userId, {
        include: {
            model: Routines,
            as: 'Routines',
            through: { attributes: [] }
        }
    });

    const assignedRoutines = (user?.Routines || []).map(transformEmotionField);
    const systemRoutines = (await Routines.findAll({ where: { createdBy: 'system' } }))
        .map(transformEmotionField);

    // Si NO hay emotionParam, devolver todas (comportamiento original)
    if (!emotionParam) {
        const combinedMap = new Map();
        [...systemRoutines, ...assignedRoutines].forEach(r => combinedMap.set(r.id, r));
        return Array.from(combinedMap.values());
    }

    // Si hay emotionParam, buscar aleatoriamente entre rutinas asignadas con esa emoción
    const assignedFiltered = assignedRoutines.filter(r =>
        r.emotion.map(e => e.toLowerCase()).includes(emotionParam.toLowerCase())
    );

    if (assignedFiltered.length > 0) {
        return [assignedFiltered[Math.floor(Math.random() * assignedFiltered.length)]];
    }

    // Si no hay en asignadas, buscar entre rutinas del sistema
    const systemFiltered = systemRoutines.filter(r =>
        r.emotion.map(e => e.toLowerCase()).includes(emotionParam.toLowerCase())
    );

    if (systemFiltered.length > 0) {
        return [systemFiltered[Math.floor(Math.random() * systemFiltered.length)]];
    }

    throw new Error(`No se encontraron rutinas con la emoción "${emotionParam}".`);
}

export async function createRoutine({ name, type, body, emotion, createdBy }) {
    const existing = await Routines.findOne({ where: { name } });

    if (existing) {
        throw new Error(`Ya existe una rutina llamada "${name}".`);
    }

    await Routines.create({
        id: `R-${uuidv4()}`,
        name: name,
        type: type,
        body: body,
        emotion: Array.isArray(emotion) ? emotion.join(', ') : emotion, // Guardamos en string
        createdBy: createdBy
    });

    return '¡Rutina creada correctamente!';
}

export async function updateRoutine({ currentName, name, type, body, emotionNames, userId }) {
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
    if (type) updateFields.type = type;
    if (body) updateFields.body = body;
    if (emotionNames) updateFields.emotion = emotionNames.join(', '); // Guardamos como string

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