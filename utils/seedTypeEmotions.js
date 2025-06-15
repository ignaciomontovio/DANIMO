import TypeEmotion from '../models/TypeEmotions.js';

const emotions = [
    { name: 'Alegria', description: 'Sensación de bienestar, placer o satisfacción.', number: 1 },
    { name: 'Ansiedad', description: 'Expectativa ante algo futuro, con inquietud o preocupación.', number: 2 },
    { name: 'Enojo', description: 'Movimiento del animo que suscita ira contra alguien.', number: 3 },
    { name: 'Miedo', description: 'Angustia ante una amenaza o peligro percibido.', number: 4 },
    { name: 'Tristeza', description: 'Estado de pena, pérdida o desánimo.', number: 5 }    
];

export const seedTypeEmotions = async () => {
    try {
        const count = await TypeEmotion.count();
        if (count === 0) {
            await TypeEmotion.bulkCreate(emotions);
            console.log('Type emotions creada correctamente');
        } else {
            console.log('La tabla TypeEmotions ya contiene datos. No se insertó nada.');
        }
    } catch (err) {
        console.error('Error al insertar emociones:', err);
    }
};