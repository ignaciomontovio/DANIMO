import { v4 as uuidv4 } from 'uuid';
import Routines from '../models/Routines.js';

export async function seedRoutines() {
    const existing = await Routines.findOne({ where: { createdBy: 'system' } });
    if (existing) {
        console.log('⚠️ Rutinas ya fueron seedadas por el sistema.');
        return;
    }

    const routines = [
        {
            id: uuidv4(),
            name: 'Abrazá tu tristeza',
            type: 'Pasos',
            body: '1. Escribí lo que sentís en un diario\n2. Hacé una caminata tranquila\n3. Llamá a alguien de confianza',
            emotion: 'Tristeza',
            createdBy: 'system',
        },
        {
            id: uuidv4(),
            name: 'Transformá el miedo en calma',
            type: 'Pasos',
            body: '1. Respiración profunda durante 5 minutos\n2. Hacé una lista de lo que te da miedo y qué podés controlar\n3. Practicá grounding (5 cosas que ves, 4 que tocás, etc.)',
            emotion: 'Miedo',
            createdBy: 'system',
        },
        {
            id: uuidv4(),
            name: 'Liberá tu enojo con inteligencia',
            type: 'Texto',
            body: 'Alejate del estímulo que te hace enojar. Escribí lo que te molestó sin filtros. Hacé actividad física o ejercicios de respiración.',
            emotion: 'Enojo',
            createdBy: 'system',
        },
        {
        id: uuidv4(),
            name: 'Domá tu ansiedad',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=ifKLyrl2mTk',
            emotion: 'Ansiedad',
            createdBy: 'system',
        }
    ];

    await Routines.bulkCreate(routines);
    console.log('✅ Rutinas seedeadas correctamente.');
}
