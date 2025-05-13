const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SleepRegisters = sequelize.define('SleepRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hoursOfSleep: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
    },
    nightmares: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

sequelize.sync();

module.exports = SleepRegisters;