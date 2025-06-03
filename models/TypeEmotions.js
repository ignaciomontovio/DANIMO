const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const TypeEmotions = sequelize.define('TypeEmotions', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = TypeEmotions;