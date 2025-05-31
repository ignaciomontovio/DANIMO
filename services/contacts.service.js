import EmergencyContacts from '../models/EmergencyContacts.js';

const findEmergencyContactByNameAndUser = async (name, userId) => {
    return await EmergencyContacts.findOne({
        where: {
            name,
            userId,
        }
    });
};

export async function getEmergencyContacts(userId) {
    const contacts = await EmergencyContacts.findAll({
        where: { userId },
        attributes: ['name', 'phoneNumber']  
    });

    return contacts;
}

export async function createEmergencyContact(name, phoneNumber ,userId ) {
    const emergencyContact = await findEmergencyContactByNameAndUser(name, userId)
    console.log(emergencyContact)
    if(emergencyContact) throw new Error('Ya hay un contacto de emergencia con este nombre.');

    await EmergencyContacts.create({
        name: name,
        phoneNumber: phoneNumber,
        userId: userId
    });
}

export async function updateEmergencyContact(userId, currentName, updates) {
    const contact = await EmergencyContacts.findOne({
        where: { userId, name: currentName }
    });

    if (!contact) throw new Error('Contacto no encontrado');

    await contact.update(updates);
}

export async function deleteEmergencyContact(name, userId) {
    const contact = await EmergencyContacts.findOne({
        where: { name, userId }
    });
    
    if (!contact) {
        throw new Error('Contacto no encontrado');
    }
    await contact.destroy();
}
