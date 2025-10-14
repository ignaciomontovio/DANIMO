import TypeActivity from '../models/TypeActivities.js';

const initialActivities = [
    // Hogar
    { name: 'Cocinar', category: 'Hogar' },
    { name: 'Limpiar', category: 'Hogar' },
    { name: 'Comprar', category: 'Hogar' },
    { name: 'Regar', category: 'Hogar' },

    // Hobby
    { name: 'Leer', category: 'Hobby' },
    { name: 'Musica', category: 'Hobby' },
    { name: 'Videojuegos', category: 'Hobby' },
    { name: 'Pintar', category: 'Hobby' },
    { name: 'Dibujar', category: 'Hobby' },
    { name: 'Gimnasio', category: 'Hobby' },
    { name: 'Fiesta', category: 'Hobby' },
    { name: 'Salir a bailar', category: 'Hobby' },
    { name: 'Amistades', category: 'Hobby' },
    { name: 'Escribir', category: 'Hobby' },
    { name: 'Deportes', category: 'Hobby' },

    // Estudio
    { name: 'Estudiar', category: 'Estudio' },
    { name: 'Investigar', category: 'Estudio' },
    { name: 'Resumir', category: 'Estudio' },

    // Trabajo
    { name: 'Trabajar', category: 'Trabajo' }
];

export default async function seedTypeActivities() {
    try {
        const count = await TypeActivity.count();

        if (count === 0) {
            await TypeActivity.bulkCreate(initialActivities);
            console.log('Actividades insertadas correctamente');
        } else {
            console.log('La tabla TypeActivities ya contiene datos. No se insertó nada.');
        }
    } catch (err) {
        console.error('Error al insertar actividades:', err);
    }
}
