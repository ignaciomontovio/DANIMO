import { validateMedicationInput } from '../utils/validators.js';
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
