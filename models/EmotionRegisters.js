const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const isTestEnv = process.env.NODE_ENV === 'test';

const EmotionRegisters = sequelize.define('EmotionRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    emotion: {
        type: DataTypes.ENUM('Alegria', 'Tristeza', 'Miedo', 'Ira', 'Sorpresa', 'Anticipacion', 'Confianza', 'Asco'),
        allowNull: false,
    },
    intensity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isPredominant: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: isTestEnv // Que cree las timestamps en el entorno de test
});

module.exports = EmotionRegisters;