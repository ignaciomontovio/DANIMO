require('dotenv').config();
const app = require('./app');
const { testConnection, syncDatabase } = require('./config/sync');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await testConnection();
    await syncDatabase(); // usa alter por defecto
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
