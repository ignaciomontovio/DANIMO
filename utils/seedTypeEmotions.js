const TypeEmotion = require('../models/TypeEmotions'); // o la ruta correspondiente

const emotions = [
    { name: 'Alegría', description: 'Sensación de bienestar, placer o satisfacción.' },
    { name: 'Tristeza', description: 'Estado de pena, pérdida o desánimo.' },
    { name: 'Ira', description: 'Respuesta emocional de enojo o frustración intensa.' },
    { name: 'Miedo', description: 'Emoción ante una amenaza o peligro percibido.' },
    { name: 'Asco', description: 'Rechazo fuerte hacia algo desagradable o repulsivo.' },
    { name: 'Sorpresa', description: 'Reacción ante algo inesperado o repentino.' },
    { name: 'Confianza', description: 'Sentimiento de seguridad o certeza en alguien o algo.' },
    { name: 'Anticipación', description: 'Expectativa ante algo futuro, con inquietud o preocupación.' }
];

const seedTypeEmotions = async () => {
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

module.exports = seedTypeEmotions;