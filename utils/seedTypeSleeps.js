import TypeSleeps from '../models/TypeSleeps.js';

const sleepTypes = [
    { name: 'Excelente', description: 'Sueño profundo, reparador y sin interrupciones.', number: 1 },
    { name: 'Bueno', description: 'Sueño mayormente bueno, pocas interrupciones.', number: 2 },
    { name: 'Regular', description: 'Sueño interrumpido o poco reparador.', number: 3 },
    { name: 'Malo', description: 'Dificultad para conciliar el sueño o despertares frecuentes.', number: 4 },
    { name: 'Muy malo', description: 'Insomnio o sueño muy perturbado.', number: 5 }
];

export const seedTypeSleep = async () => {
    try {
        const count = await TypeSleeps.count();
        if (count === 0) {
            await TypeSleeps.bulkCreate(sleepTypes);
            console.log('TypeSleeps creada correctamente');
        } else {
            console.log('La tabla TypeSleeps ya contiene datos. No se insertó nada.');
        }
    } catch (err) {
        console.error('Error al insertar tipos de sueño:', err);
    }
};
