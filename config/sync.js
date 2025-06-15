import { init } from './database.js';
import * as models from '../models/index.js';

async function syncDatabase(syncOpts = { alter: true }) {
    const sequelize = init();
    try {
        await sequelize.sync(syncOpts);
        console.log("✅ Tablas sincronizadas correctamente.");
    } catch (error) {
        console.error("❌ Error al sincronizar tablas:", error);
        process.exit(1);
    }
}

async function testConnection() {
    const sequelize = init();
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

export { syncDatabase, testConnection };
