const TypeActivity = require('../models/TypeActivities'); // o la ruta correspondiente

const initialActivities = [
    // Hogar
    { name: 'Cocinar', category: 'Hogar' },
    { name: 'Limpiar', category: 'Hogar' },
    { name: 'Lavar', category: 'Hogar' },
    { name: 'Ordenar', category: 'Hogar' },
    { name: 'Comprar', category: 'Hogar' },
    { name: 'Regar', category: 'Hogar' },
    { name: 'Reparar', category: 'Hogar' },

    // Hobby
    { name: 'Leer', category: 'Hobby' },
    { name: 'Musica', category: 'Hobby' },
    { name: 'Instrumento', category: 'Hobby' },
    { name: 'Videojuegos', category: 'Hobby' },
    { name: 'Pintar', category: 'Hobby' },
    { name: 'Dibujar', category: 'Hobby' },
    { name: 'Entrenar', category: 'Hobby' },
    { name: 'Bailar', category: 'Hobby' },
    { name: 'Salida', category: 'Hobby' },

    // Estudio
    { name: 'Estudiar', category: 'Estudio' },
    { name: 'Escribir', category: 'Estudio' },
    { name: 'Investigar', category: 'Estudio' },
    { name: 'Practicar', category: 'Estudio' },
    { name: 'Resumir', category: 'Estudio' },

    // Trabajo
    { name: 'Reunirse', category: 'Trabajo' },
    { name: 'Viajar', category: 'Trabajo' },
    { name: 'Entregas', category: 'Trabajo' },
    { name: 'Informes', category: 'Trabajo' },
    { name: 'Presentaciones', category: 'Trabajo' },
    { name: 'Planear', category: 'Trabajo' },
    { name: 'Supervisar', category: 'Trabajo' },
    { name: 'Redactar', category: 'Trabajo' },
    { name: 'Responder', category: 'Trabajo' }
];

const seedTypeActivities = async () => {
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
};

module.exports = seedTypeActivities;