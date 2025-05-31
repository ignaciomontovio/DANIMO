const { validateEmergencyContactInput, validateUpdateEmergencyContactInput, validateDeleteEmergencyContactInput } = require('../utils/validators');
const service = require('../services/contacts.service');

exports.createEmergencyContact = async (req, res) => {
    const {error} = validateEmergencyContactInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        await service.createEmergencyContact(req.body.name, req.body.phoneNumber, req.userId);
        res.json({message: '¡Contacto de emergencia creado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /contact:', err);
        return res.status(500).json({error: 'Error al crear contacto de emergencia'});
    }
}

exports.getEmergencyContacts = async (req, res) => {
    try {
        const contacts = await service.getEmergencyContacts(req.userId); 
        res.json(contacts);
    } catch (err) {
        console.error('❌ Error al obtener contactos de emergencia:', err.message);
        res.status(500).json({ error: 'No se pudieron obtener los contactos de emergencia' });
    }
};

exports.updateEmergencyContact = async (req, res) => {
    const { error } = validateUpdateEmergencyContactInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.userId;
    const { currentName, name, phoneNumber } = req.body;

    try {
        const updates = {};
        if (name) updates.name = name;
        if (phoneNumber) updates.phoneNumber = phoneNumber;

        await service.updateEmergencyContact(userId, currentName, updates);
        res.json({ message: 'Contacto actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar contacto:', err);
        res.status(500).json({ error: 'No se pudo actualizar el contacto' });
    }
};

exports.deleteEmergencyContact = async (req, res) => {
    const { error } = validateDeleteEmergencyContactInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name } = req.body;
    const userId = req.userId;
    
    try {
        await service.deleteEmergencyContact(name, userId);
        res.json({ message: 'Contacto de emergencia eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar contacto de emergencia:', err);
        res.status(500).json({ error: 'No se pudo eliminar el contacto de emergencia' });
    }
};
