const { Sequelize } = require("sequelize");
let sequelizeInstance = null; // Variable para almacenar la instancia de Sequelize

function logger(msg) {
    // Mostrar mensajes de advertencia (warn) y errores (error)
    const isExecutionMsg = msg.includes("Executing");

    if (!isExecutionMsg) {
        console.log("Sequelize:", msg);
        return;
    }

    if (process.env.DEBUG === "true") console.log("Sequelize DEBUG:", msg);
}

// Función para obtener o crear la instancia de Sequelize
function init() {
    // Si no esta inicializada, la creo.
    if (!sequelizeInstance) {
        sequelizeInstance = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: "mysql",
                logging: logger,
            }
        );
    }

    return sequelizeInstance;
}

async function sync(sequelize, syncOpts) {
    // Importando modelos
    const models = require("./models/_models.js");

    // Definicion de relaciones


    // Sincronización

    try {
        const SYNC_OPTIONS = {
            force: { force: true },
            alter: { alter: true },
        };
        await sequelize.sync(syncOpts || SYNC_OPTIONS.alter).then(() => {
            console.log("Tablas Sincronizadas correctamente.");
        });
    } catch (error) {
        console.error("Error al crear las tablas:", error);
        process.exit(1);
    }
}

module.exports = { init, sync };