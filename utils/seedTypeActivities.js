const TypeActivity = require('../models/TypeActivities'); // o la ruta correspondiente

const initialActivities = [
    { name: 'Cocinar', category: 'Hogar' },
    { name: 'Limpiar', category: 'Hogar' },
    { name: 'Lavar ropa', category: 'Hogar' },
    { name: 'Leer un libro', category: 'Hobby' },
    { name: 'Escuchar musica', category: 'Hobby' },
    { name: 'Tocar un instrumento', category: 'Hobby' },
    { name: 'Jugar videojuegos', category: 'Hobby' },
    { name: 'Pintar o dibujar', category: 'Hobby' },
    { name: 'Entrenar', category: 'Hobby' },
    { name: 'Deporte', category: 'Hobby' },
    { name: 'Estudiar', category: 'Estudio' },
    { name: 'Clase', category: 'Estudio' },
    { name: 'Tarea', category: 'Estudio' },
    { name: 'Reunion', category: 'Trabajo' },
    { name: 'Viajar', category: 'Trabajo' },
    { name: 'Entregas', category: 'Trabajo' },
    { name: 'Informes', category: 'Trabajo' },
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