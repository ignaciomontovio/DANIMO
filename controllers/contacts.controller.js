import {
  validateEmergencyContactInput,
  validateUpdateEmergencyContactInput,
  validateDeleteEmergencyContactInput
} from '../utils/validators.js';
import * as service from '../services/contacts.service.js';

export const createEmergencyContact = async (req, res) => {
  const { error } = validateEmergencyContactInput(req.body);
  if (error) {
    console.error("❌ Error in joi validation Error:" + error.details[0].message)
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    await service.createEmergencyContact(req.body.name, req.body.phoneNumber,
      req.body.who, req.userId);
    console.log(`✅ Contacto creado para el usuario ${req.userId}: ${req.body.name} - ${req.body.phoneNumber}`);
    res.json({ message: '¡Contacto de emergencia creado correctamente!' });
  } catch (err) {
    console.error(`❌ [createEmergencyContact] Error en servicio:`, err);
    return res.status(500).json({ error: err.message });
  }
};

export const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await service.getEmergencyContacts(req.userId);
    console.log(`✅ Contactos de emergencia obtenidos para el usuario ${req.userId}`);
    res.json(contacts);
  } catch (err) {
    console.error('❌ Error al obtener contactos de emergencia:', err.message);
    res.status(500).json(
      { error: 'No se pudieron obtener los contactos de emergencia' });
  }
};

export const updateEmergencyContact = async (req, res) => {
  const { error } = validateUpdateEmergencyContactInput(req.body);
  if (error) {
    console.error("❌ Error in joi validation Error:" + error.details[0].message)
    return res.status(400).json({ error: error.details[0].message });
  }

  const { currentPhoneNumber, name, phoneNumber, who } = req.body;
  const updates = {};
  if (name) {
    updates.name = name;
  }
  if (phoneNumber) {
    updates.phoneNumber = phoneNumber;
  }
  if (who) {
    updates.who = who;
  }

  try {
    await service.updateEmergencyContact(req.userId, currentPhoneNumber,
      updates);
    console.log(`✅ Contacto actualizado para usuario ${req.userId}. Teléfono actual: ${currentPhoneNumber}, Actualizaciones: ${JSON.stringify(updates)}`);
    res.json({ message: 'Contacto actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar contacto:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmergencyContact = async (req, res) => {
  const { error } = validateDeleteEmergencyContactInput(req.body);
  if (error) {
    console.error("❌ Error in joi validation Error:" + error.details[0].message)
    return res.status(400).json({ error: error.details[0].message });
  }

  const { phoneNumber } = req.body;

  try {
    await service.deleteEmergencyContact(phoneNumber, req.userId);
    console.log(`✅ Contacto eliminado para usuario ${req.userId}: ${phoneNumber}`);
    res.json({ message: 'Contacto de emergencia eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar contacto de emergencia:', err);
    res.status(500).json({ error: err.message });
  }
};

export const emergencyButton = async (req, res) => {
  try {
    await service.emergencyButton(req.userId);
    console.log(`✅ Se ha informado la emergencia a los contactos de emergencia`);
    res.json(
      { message: 'Se ha informado la emergencia a los contactos de emergencia' });
  } catch (err) {
    console.error('❌ Error al informar a los contactos de emergencia:', err);
    res.status(500).json({ error: err.message });
  }
};