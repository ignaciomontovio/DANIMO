const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const SleepRegisters = sequelize.define('SleepRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    hoursOfSleep: {
        type: DataTypes.FLOAT,
        allowNull: true,
        unique: false,
    },
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = SleepRegisters;