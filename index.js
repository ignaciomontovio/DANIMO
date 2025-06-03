require('dotenv').config();
const app = require('./app');
const { testConnection, syncDatabase } = require('./config/sync');
const seedQuotesIfEmpty = require('./utils/seedQuotes');
const seedTypeActivities = require('./utils/seedTypeActivities');
const seedTypeEmotions = require('./utils/seedTypeEmotions');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await testConnection();
    //await syncDatabase({ force: true }); //Para que la base se cree desde 0
    await syncDatabase(); // usa alter por defecto
    await seedQuotesIfEmpty();
    await seedTypeActivities();
    await seedTypeEmotions();
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
