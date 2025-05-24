const { Sequelize } = require("sequelize");

let sequelizeInstance = null;

function logger(msg) {
    const isQuery = msg.includes("Executing");
    if (!isQuery || process.env.DEBUG === "true") {
        console.log("Sequelize:", msg);
    }
}

function init() {
    if (!sequelizeInstance) {
        if (process.env.NODE_ENV === 'test') {
            // Base de datos en memoria para testing
            sequelizeInstance = new Sequelize({
                dialect: 'sqlite',
                storage: ':memory:',
                logging: false, // desactiva logs en test
            });
        } else {
            // Config normal (Postgres u otro)
            sequelizeInstance = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USERNAME,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    dialect: "postgres", // o "mysql"
                    logging: logger,
                }
            );
        }
    }
    return sequelizeInstance;
}

module.exports = { init };
