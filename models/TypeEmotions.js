const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const TypeEmotions = sequelize.define('TypeEmotions', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true  // 👉 ahora `name` es la PK
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = TypeEmotions;