const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const SleepRegisters = sequelize.define('SleepRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    hoursOfSleep: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
    },
    nightmares: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    },
    dailyRegisterId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // ✅ Esto impide múltiples registros con el mismo dailyRegisterId
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = SleepRegisters;