import cron from 'node-cron';
import { deactivateFinishedMedications } from '../services/medications.service.js';

cron.schedule('0 0 * * *', async () => {
    console.log('🕛 [CRON] Verificando medicaciones vencidas...');
    await deactivateFinishedMedications();
});