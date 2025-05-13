const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmergencyContacts = sequelize.define('EmergencyContacts', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

sequelize.sync();

module.exports = EmergencyContacts;