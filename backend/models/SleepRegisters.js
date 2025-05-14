const { DataTypes } = require('sequelize');
const sequelize = require('./sequelizeConfig').init()

const SleepRegisters = sequelize.define('SleepRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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

module.exports = SleepRegisters;