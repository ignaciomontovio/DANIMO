import EmergencyContacts from '../models/EmergencyContacts.js';
import {sendMessage} from './sms.service.js';
import Users from '../models/Users.js';

export async function emergencyButton(userId) {
    const user = await Users.findOne({
        where: {id: userId}
    })
    const emergencyContacts = await EmergencyContacts.findAll({
        where: {userId},
    })
    for (const contact of emergencyContacts) {
        const msj = "Hola " + contact.name + ", esto es un mensaje de emergencia debido " +
            "a que " + user.firstName + " " + user.lastName + " ha solicitado ayuda."
        await sendMessage(contact.phoneNumber, msj)
    }
}

const findEmergencyContactByPhoneAndUser = async (phoneNumber, userId) => {
    return await EmergencyContacts.findOne({
        where: {phoneNumber, userId}
    });
};

export async function getEmergencyContacts(userId) {
    return await EmergencyContacts.findAll({
        where: {userId}, attributes: ['name', 'phoneNumber', 'who']
    });
}

export async function createEmergencyContact(name, phoneNumber, who, userId) {
    const exists = await findEmergencyContactByPhoneAndUser(phoneNumber, userId);
    if (exists) throw new Error('Ya hay un contacto de emergencia con este número.');

    await EmergencyContacts.create({
        name, phoneNumber, who, userId
    });
}

export async function updateEmergencyContact(userId, currentPhoneNumber, updates) {
    const contact = await EmergencyContacts.findOne({
        where: {phoneNumber: currentPhoneNumber, userId}
    });

    if (!contact) throw new Error('Contacto no encontrado');

    await contact.update(updates);
}

export async function deleteEmergencyContact(phoneNumber, userId) {
    const contact = await EmergencyContacts.findOne({
        where: {phoneNumber, userId}
    });

    if (!contact) throw new Error('Contacto no encontrado');

    await contact.destroy();
}
