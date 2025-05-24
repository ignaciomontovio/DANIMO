const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

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
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = EmotionRegisters;