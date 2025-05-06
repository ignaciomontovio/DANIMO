const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('DANIMO', 'grupo101', 'grupo101', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
