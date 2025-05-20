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
        sequelizeInstance = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: "postgres", //Cambiado de "mysql" a "postgres"
                logging: logger,
            }
        );
    }
    return sequelizeInstance;
}

module.exports = { init };
