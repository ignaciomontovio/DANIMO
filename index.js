import dotenv from 'dotenv';
dotenv.config();
import app from './app/index.js';
import { testConnection, syncDatabase } from './config/sync.js';
import seedQuotesIfEmpty from './utils/seedQuotes.js';
import seedTypeActivities from './utils/seedTypeActivities.js';
import {seedTypeEmotions} from './utils/seedTypeEmotions.js';
import {seedTypeSleep} from './utils/seedTypeSleeps.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await testConnection();
    //await syncDatabase({ force: true }); //Para que la base se cree desde 0
    await syncDatabase(); // usa alter por defecto
    await seedQuotesIfEmpty();
    await seedTypeActivities();
    await seedTypeEmotions();
    await seedTypeSleep();
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
