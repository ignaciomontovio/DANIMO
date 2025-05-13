const { DataTypes } = require('sequelize');
const sequelize = require('./sequelizeConfig').init()
const { date } = require('joi');

const ActivityRegisters = sequelize.define('ActivityRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = ActivityRegisters;