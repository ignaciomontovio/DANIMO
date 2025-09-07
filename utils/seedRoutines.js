import {createRoutine} from '../services/routines.service.js';

export async function seedRoutines() {

    const routines = [
        {
            name: 'Abrazá tu tristeza',
            type: 'Pasos',
            body: `[{"id":1718299140000,"titulo":"Paso 1","descripcion":"Escribí lo que sentís en un diario"},{"id": 1718299140001,"titulo": "Paso 2","descripcion": "Hacé una caminata tranquila"},{"id": 1718299140002,"titulo": "Paso 3","descripcion": "Llamá a alguien de confianza"}]`,
            emotion: ['Tristeza'],
            createdBy: 'system',
        },
        {
            name: 'Transformá el miedo en calma',
            type: 'Pasos',
            body: `[{"id":1718299140000,"titulo":"Paso 1","descripcion":"Escribí lo que sentís en un diario"},{"id":1718299140001,"titulo":"Paso 2","descripcion":"Hacé una caminata tranquila"},{"id":1718299140002,"titulo":"Paso 3","descripcion":"Llamá a alguien de confianza"}]`,
            emotion: ['Miedo'],
            createdBy: 'system',
        },
        {
            name: 'Liberá tu enojo con inteligencia',
            type: 'Texto',
            body: 'Alejate del estímulo que te hace enojar. Escribí lo que te molestó sin filtros. Hacé actividad física o ejercicios de respiración.',
            emotion: ['Enojo'],
            createdBy: 'system',
        },
        {
            name: 'Domá tu ansiedad',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=ifKLyrl2mTk',
            emotion: ['Ansiedad'],
            createdBy: 'system',
        }
    ];
    for (const routine of routines) {
        await createRoutine(routine);
    }
    console.log('✅ Rutinas seedeadas correctamente.');
}
