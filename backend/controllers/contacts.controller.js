const { validateEmergencyContactInput } = require('../utils/validators');
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