const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RegistroDeEmocion = sequelize.define('RegistroDeEmocion', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    actividad: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

sequelize.sync();

module.exports = Usuario;