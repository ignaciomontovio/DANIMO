import { validateMedicationInput, validateMedicationNameQuery } from '../utils/validators.js';
import * as service from '../services/medications.service.js';

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
        console.log(`✅ Medicaciones activas obtenidas para userId=${userId}`);
        res.json({ message: 'Medicaciones activas obtenidas con éxito', data: medications });
    } catch (err) {
        console.error('❌ Error al obtener medicaciones activas:', err);
        res.status(500).json({ error: 'Error al obtener medicaciones activas' });
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
            console.warn(`⚠️ No se encontró medicación activa con name="${name}" para userId=${userId}`);
            return res.status(404).json({ error: 'No se encontró la medicación activa con ese nombre' });
        }

        console.log(`✅ Detalle de medicación obtenido exitosamente para userId=${userId}, name="${name}"`);
        res.json({ message: 'Detalle de medicación obtenido con éxito', data: medication });
    } catch (err) {
        console.error('❌ Error al obtener el detalle de la medicación:', err);
        res.status(500).json({ error: 'Error al obtener el detalle de la medicación' });
    }
};
