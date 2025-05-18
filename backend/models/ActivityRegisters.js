const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()
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
        type: DataTypes.ENUM('Trabajo', 'Estudio', 'Hobby', 'Hogar'),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = ActivityRegisters;