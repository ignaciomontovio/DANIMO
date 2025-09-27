import { createRoutine } from '../services/routines.service.js';
import Routines from "../models/Routines.js";

export async function seedRoutines() {
    const routines = [
        {
            name: 'Diario emocional',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299140000, titulo: 'Paso 1', descripcion: 'Escribí lo que sentís en un diario, sin juzgarte.' },
                { id: 1718299140001, titulo: 'Paso 2', descripcion: 'Identificá la emoción principal y su intensidad en una escala del 1 al 10.' },
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
                { id: 1718299160000, titulo: 'Paso 1', descripcion: 'Reconocé el enojo y alejate del estímulo y tomate unos minutos.' },
                { id: 1718299160001, titulo: 'Paso 2', descripcion: 'Realizá actividad física moderada (caminar, trotar, estiramientos).' },
                { id: 1718299160002, titulo: 'Paso 3', descripcion: 'Escribí lo que te molestó, si estás más calmado reconsidera como te sentís ante esta situación.' },
                { id: 1718299160002, titulo: 'Paso 3', descripcion: 'Pensá como te sentirías mas cómodo afrontando esto la próxima vez.' }
            ]),
            emotion: ['Enojo'],
            createdBy: 'system',
        },
        {
            name: 'Ejercicio moderado',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299170000, titulo: 'Paso 1', descripcion: 'Realizá 10 minutos de estiramientos suaves.' },
                { id: 1718299170001, titulo: 'Paso 2', descripcion: 'Elegí una canción que te guste y ponete a bailar durante 10 minutos.' },
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
            name: 'Maneja tu ansiedad',
            type: 'Pasos',
            body: JSON.stringify([
                { id: 1718299180000, titulo: 'Paso 1', descripcion: 'Respira profundo (inhala 4, sostener 4, exhalar 6).' },
                { id: 1718299180001, titulo: 'Paso 2', descripcion: 'Toca algo suave o frío.' },
                { id: 1718299180002, titulo: 'Paso 3', descripcion: 'Nombra 5 cosas que veo.' },
                { id: 1718299180003, titulo: 'Paso 4', descripcion: 'Ponerme una canción que me relaje .' },
                { id: 1718299180003, titulo: 'Paso 5', descripcion: 'Recordar: Esto va a pasar, no estoy solo.' }
            ]),
            emotion: ['Ansiedad', 'Miedo'],
            createdBy: 'system',
        },
        {
            name: 'Apoyo social',
            type: 'Texto',
            body: 'Contactá a alguien de confianza y compartí cómo te sentís, recordá que no estas solo. El apoyo social es clave para el bienestar emocional.',
            emotion: ['Tristeza', 'Ansiedad', 'Miedo'],
            createdBy: 'system',
        },
        {
            name: 'Respiracion de Jacobson',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=eu-2iWv_fCM',
            emotion: ['Ansiedad', 'Miedo'],
            createdBy: 'system',
        },
        {
            name: 'Meditación mindfulness',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=9-IOMXpv7Ys',
            emotion: ['Ansiedad', 'Enojo', 'Miedo', 'Tristeza'],
            createdBy: 'system',
        },
        {
            name: 'Controlar ataque de pánico',
            type: 'Video',
            body: 'https://www.youtube.com/watch?v=NG_RTAxcMLw&t=304s',
            emotion: ['Ansiedad'],
            createdBy: 'system',
        }
    ];
    for (const routine of routines) {
        if(!await Routines.findOne({ where: { name: routine.name } }))
            await createRoutine(routine);
    }
    console.log('✅ Rutinas seedeadas correctamente.');
}
