const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const sequelizeConfig = require('./orm/sequelizeConfig')
const seq = sequelizeConfig.init()
sequelizeConfig.sync(seq, { force: true })
testConnection()

// Importa rutas
const apiRoutes = require('./routes/api');
const registerRoutes = require('./routes/auth');
const chatgpt = require('./routes/OpenIA/chat');
const professionalRoutes = require('./routes/professionalsAuth');
const activity = require('./routes/registers/activityRegister');
const dailiy = require('./routes/registers/dailyRegister');
const emotion = require('./routes/registers/emotionRegister');
const sleep = require('./routes/registers/sleepRegister');

app.use('/api', apiRoutes);
app.use('/auth', registerRoutes)
app.use('/api', chatgpt)
app.use('/professionalsAuth', professionalRoutes)
app.use('/activity', activity)
app.use('/daily', dailiy)
app.use('/emotion', emotion)
app.use('/sleep', sleep)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

async function testConnection() {
    try {
        await seq.authenticate();
        console.log('✅ Conexión establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}