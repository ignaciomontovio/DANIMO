import dotenv from 'dotenv';

dotenv.config();
import app from './app/index.js';
import {testConnection, syncDatabase} from './config/sync.js';
import seedQuotesIfEmpty from './utils/seedQuotes.js';
import seedTypeActivities from './utils/seedTypeActivities.js';
import {seedTypeEmotions} from './utils/seedTypeEmotions.js';
import {seedTypeSleep} from './utils/seedTypeSleeps.js';
import {seedRoutines} from './utils/seedRoutines.js';
import {notificationServiceInitialize} from './services/notifications.services.js';
import seedUsersIfEmpty from './utils/seedUsers.js';
import seedProfessionalsIfEmpty from "./utils/seedProfessionals.js";
import seedUserProfessionalLinks from "./utils/seedLinkedPatients.js";
import seedAnaGarciaChat from "./utils/seedChats/seedAnaGarciaChat.js";
import seedLuisMartinezChat from "./utils/seedChats/seedLuisMartinezChat.js";
import seedCarlosPerezChat from "./utils/seedChats/seedCarlosPerezChat.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await testConnection();
    //await syncDatabase({ force: true }); //Para que la base se cree desde 0
    await syncDatabase(); // usa alter por defecto
    await seedQuotesIfEmpty();
    await seedTypeActivities();
    await seedTypeEmotions();
    await seedTypeSleep();
    await seedRoutines();
    await seedUsersIfEmpty();
    await seedProfessionalsIfEmpty();
    await seedUserProfessionalLinks();
    await notificationServiceInitialize()
    await seedAnaGarciaChat()
    await seedLuisMartinezChat()
    await seedCarlosPerezChat()
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
