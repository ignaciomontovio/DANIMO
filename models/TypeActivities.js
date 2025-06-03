const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const TypeActivities = sequelize.define('TypeActivities', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true  // 👈 clave primaria
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = TypeActivities;