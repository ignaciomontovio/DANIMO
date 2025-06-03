const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const Photos = sequelize.define('Photos', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT, // TEXT porque base64 puede ser largo
        allowNull: false,
    },
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = Photos;