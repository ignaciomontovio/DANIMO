import { validateMedicationInput, validateMedicationNameQuery, 
    validateEditMedicationInput, validateDeleteMedicationInput } from '../utils/validators.js';
import * as service from '../services/medications.service.js';
import { validatePatientMedicationRequest } from '../utils/validators.js';
import Professionals from '../models/Professionals.js';
import Users from '../models/Users.js';

export const createMedication = async (req, res) => {
    const { error } = validateMedicationInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }

    const { startDate, endDate, name, dosage } = req.body;
    const userId = req.userId;

    try {
        await service.createMedication({
            userId,
            startDate,
            endDate,
            name,
            dosage
        });
        console.log("✅ Medicación registrada correctamente")
        res.status(201).json({ message: '¡Medicación registrada correctamente!' });
    } catch (err) {
        console.error('❌ Error al registrar medicación:', err);
        res.status(500).json({ error: 'Error al registrar medicación' });
    }
};

export const getActiveMedications = async (req, res) => {
    const userId = req.userId;

    try {
        const medications = await service.getActiveMedicationsByUser(userId);
        console.log(`✅ Medicaciones obtenidas para userId=${userId}`);
        res.json({ message: 'Medicaciones obtenidas con éxito', data: medications });
    } catch (err) {
        console.error('❌ Error al obtener medicaciones:', err);
        res.status(500).json({ error: 'Error al obtener medicaciones ' });
    }
};

export const getMedicationDetail = async (req, res) => {
    const userId = req.userId;

    const { error } = validateMedicationNameQuery(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name } = req.body;
    try {
        const medication = await service.getMedicationDetailByName(userId, name);

        if (!medication) {
            console.warn(`⚠️ No se encontró medicación con name="${name}" para userId=${userId}`);
            return res.status(404).json({ error: 'No se encontró la medicación con ese nombre' });
        }

        console.log(`✅ Detalle de medicación obtenido exitosamente para userId=${userId}, name="${name}"`);
        res.json({ message: 'Detalle de medicación obtenido con éxito', data: medication });
    } catch (err) {
        console.error('❌ Error al obtener el detalle de la medicación:', err);
        res.status(500).json({ error: 'Error al obtener el detalle de la medicación' });
    }
};

export const editMedication = async (req, res) => {
    const { error, value } = validateEditMedicationInput(req.body);
    if (error) {
        console.error('❌ Error en validación:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const { currentName, ...updates } = value;

    try {
        const result = await service.editMedication(userId, currentName, updates);
        if (!result) {
            console.warn(`⚠️ No se encontró medicación ${currentName} para el user ${userId}.`);
            return res.status(404).json({ error: 'Medicación no encontrada' });
        }
        console.log(`✅ Medicación ${currentName} actualizada correctamente para user ${userId}.`);
        res.status(200).json({ message: 'Medicación actualizada correctamente' });
    } catch (err) {
        console.error('❌ Error al editar medicación:', err.message);
        res.status(500).json({ error: 'Error al editar medicación' });
    }
};

export const deleteMedication = async (req, res) => {
    const { error } = validateDeleteMedicationInput(req.body);
    if (error) {
        console.error('❌ Error validando delete medication:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name } = req.body;
    const userId = req.userId;

    try {
        await service.softDeleteMedication({ userId, name });
        console.log(`✅ Medicación ${name} marcada como inactiva para userId=${userId}.`);
        res.json({ message: `Medicación ${name} eliminada correctamente.` });
    } catch (err) {
        console.error('❌ Error eliminando medicación:', err);
        res.status(500).json({ error: 'Error eliminando medicación' });
    }
};

export const getMedicationsByPatient = async (req, res) => {
    try {
        const professionalId = req.userId;

        // 1. Validar que quien hace la request es un profesional
        const isProfessional = await Professionals.findByPk(professionalId);
        if (!isProfessional) {
            return res.status(403).json({
                error: 'Solo los profesionales pueden acceder a este recurso.'
            });
        }

        // 2. Validar body
        const { error } = validatePatientMedicationRequest(req.body);
        if (error) {
            console.warn('⚠️ Validación fallida en /medications/patient:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const { id: patientId } = req.body;

        // 3. Confirmar que el usuario existe
        const userExists = await Users.findByPk(patientId);
        if (!userExists) {
            return res.status(404).json({ error: 'El usuario indicado no existe.' });
        }

        // 4. Obtener medicaciones desde el service
        const medications = await service.getMedicationsByUserOrdered(patientId);

        return res.status(200).json({
            message: 'Medicaciones obtenidas correctamente.',
            data: medications
        });
    } catch (err) {
        console.error('❌ Error en getMedicationsByPatient:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};