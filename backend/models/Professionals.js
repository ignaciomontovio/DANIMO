const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Professionals = sequelize.define('Professionals', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

Professionals.associate = (models) => {
    Professionals.hasMany(models.Usuario, { foreignKey: 'userId' });
};

sequelize.sync();

module.exports = Usuario;