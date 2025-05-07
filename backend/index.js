const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// test-connection.js
const sequelize = require('./db');
testConnection();

// Importa rutas
const apiRoutes = require('./routes/api');
const registerRoutes = require('./routes/auth');
app.use('/api', apiRoutes);
app.use('/auth', registerRoutes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}