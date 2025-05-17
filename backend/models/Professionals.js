const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const Professionals = sequelize.define('Professionals', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    hasGoogleAccount:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    },
    profession: {
        type: DataTypes.ENUM('Psicologo', 'Psiquiatra'),
        allowNull: false
    },
    /* MATRICULA. Ver mas adelante
    license: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }*/
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = Professionals;