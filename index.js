require('dotenv').config();
const app = require('./app');
const { testConnection, syncDatabase } = require('./config/sync');
const seedQuotesIfEmpty = require('./utils/seedQuotes');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await testConnection();
    await syncDatabase(); // usa alter por defecto
    await seedQuotesIfEmpty();
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
