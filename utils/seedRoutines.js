import { createRoutine } from '../services/routines.service.js';
import Routines from "../models/Routines.js";

export async function seedRoutines() {
    const routines = [
        {
            name: 'Diario emocional',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299140000, titulo: 'Paso 1', descripcion: 'Escribí lo que sentís en un diario, sin juzgarte.' },
                { id: 1718299140001, titulo: 'Paso 2', descripcion: 'Identificá la emoción principal y su intensidad.' },
                { id: 1718299140002, titulo: 'Paso 3', descripcion: 'Reflexioná sobre qué te ayudó en el pasado a sentirte mejor.' }
            ]),
            emotion: ['Tristeza', 'Ansiedad'],
            createdBy: 'system',
        },
        {
            name: 'Mindfulness para el miedo',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299150000, titulo: 'Paso 1', descripcion: 'Sentate en un lugar tranquilo y cerrá los ojos.' },
                { id: 1718299150001, titulo: 'Paso 2', descripcion: 'Respirá profundo y enfocá tu atención en la respiración.' },
                { id: 1718299150002, titulo: 'Paso 3', descripcion: 'Observá tus pensamientos sin intentar cambiarlos.' }
            ]),
            emotion: ['Miedo', 'Ansiedad'],
            createdBy: 'system',
        },
        {
            name: 'Gestión saludable del enojo',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299160000, titulo: 'Paso 1', descripcion: 'Reconocé el enojo y alejate del estímulo.' },
                { id: 1718299160001, titulo: 'Paso 2', descripcion: 'Realizá actividad física moderada (caminar, trotar, estiramientos).' },
                { id: 1718299160002, titulo: 'Paso 3', descripcion: 'Escribí lo que te molestó y pensá en una solución constructiva.' }
            ]),
            emotion: ['Enojo'],
            createdBy: 'system',
        },
        {
            name: 'Meditación guiada para la ansiedad',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=inpok4MKVLM',
            emotion: ['Ansiedad'],
            createdBy: 'system',
        },
        {
            name: 'Ejercicio físico recomendado',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299170000, titulo: 'Paso 1', descripcion: 'Realizá 10 minutos de estiramientos suaves.' },
                { id: 1718299170001, titulo: 'Paso 2', descripcion: 'Caminá o corré durante 20 minutos a ritmo moderado.' },
                { id: 1718299170002, titulo: 'Paso 3', descripcion: 'Hidratate y hacé respiraciones profundas.' }
            ]),
            emotion: ['Tristeza'],
            createdBy: 'system',
        },
        {
            name: 'Respiración consciente',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299180000, titulo: 'Paso 1', descripcion: 'Sentate en un lugar cómodo.' },
                { id: 1718299180001, titulo: 'Paso 2', descripcion: 'Inhalá por la nariz contando hasta 4.' },
                { id: 1718299180002, titulo: 'Paso 3', descripcion: 'Exhalá por la boca contando hasta 6.' },
                { id: 1718299180003, titulo: 'Paso 4', descripcion: 'Repetí este ciclo de respiración consciente entre 5 y 10 veces, según lo que necesites para sentirte más relajado.' }
            ]),
            emotion: ['Ansiedad', 'Miedo'],
            createdBy: 'system',
        },
        {
            name: 'Apoyo social',
            type: 'Texto',
            body: 'Contactá a alguien de confianza y compartí cómo te sentís. El apoyo social es clave para el bienestar emocional.',
            emotion: ['Tristeza', 'Ansiedad'],
            createdBy: 'system',
        },
        {
            name: 'Respiracion para dormir',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=IShkpOm63gg',
            emotion: ['Ansiedad', 'Miedo'],
            createdBy: 'system',
        }
    ];
    for (const routine of routines) {
        if(!await Routines.findOne({ where: { name: routine.name } }))
            await createRoutine(routine);
    }
    console.log('✅ Rutinas seedeadas correctamente.');
}
