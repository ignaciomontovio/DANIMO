const { DataTypes } = require('sequelize');
const sequelize = require('../orm/sequelizeConfig').init()

const EmotionRegisters = sequelize.define('EmotionRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    emotion: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = EmotionRegisters;