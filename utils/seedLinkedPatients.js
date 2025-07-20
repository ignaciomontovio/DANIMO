// utils/seedLinkedPatients.js

import Users from '../models/Users.js';
import Professionals from '../models/Professionals.js';
// Nota: no necesitamos importar el modelo intermedio directamente

const links = [
    { userEmail: 'ana@example.com', professionalEmail: 'laura.pro@example.com' },
    { userEmail: 'luis@example.com', professionalEmail: 'laura.pro@example.com' },
    { userEmail: 'sofia@example.com', professionalEmail: 'javier.pro@example.com' },
    { userEmail: 'carlos@example.com', professionalEmail: 'javier.pro@example.com' }
];

export default async function seedUserProfessionalLinks() {
    for (const { userEmail, professionalEmail } of links) {
        const user = await Users.findOne({ where: { email: userEmail } });
        const professional = await Professionals.findOne({
        where: { email: professionalEmail }
        });

        if (!user) {
        console.warn(`⚠️ Usuario no encontrado: ${userEmail}`);
        continue;
        }
        if (!professional) {
        console.warn(`⚠️ Profesional no encontrado: ${professionalEmail}`);
        continue;
        }

        // Verificamos si la asociación ya existe
        const existing = await professional.hasUser(user);
        if (existing) {
        console.log(`🔁 Asociación ya existe: ${userEmail} → ${professionalEmail}`);
        continue;
        }

        // Creamos la asociación
        await professional.addUser(user);
        console.log(`✅ Asociado user(${userEmail}) → professional(${professionalEmail})`);
    }
}