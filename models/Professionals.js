import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

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
    birthDate:{
        type: DataTypes.DATE,
        allowNull: true,
        unique: false
    },
    gender: {
        type: DataTypes.ENUM('Masculino', 'Femenino','No Binario','Prefiero no decir'),
        allowNull: false,
        unique: false
    },
    /* MATRICULA. Ver mas adelante
    license: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }*/
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default Professionals;
