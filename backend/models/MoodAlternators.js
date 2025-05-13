const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const MoodAlternators = sequelize.define('MoodAlternators', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = MoodAlternators;