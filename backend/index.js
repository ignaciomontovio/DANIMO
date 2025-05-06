const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// test-connection.js
const sequelize = require('./db/db');
testConnection();

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

// Importa rutas
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

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