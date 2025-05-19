const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const Medications = sequelize.define('Medications', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = Medications;