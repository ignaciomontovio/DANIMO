const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const EmergencyContacts = sequelize.define('EmergencyContacts', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    who: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = EmergencyContacts;