import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const Users = sequelize.define('Users', {
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
    occupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    livesWith: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePic: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    firebaseToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        defaultValue: null
    },
    hasAcceptedTerms:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default Users;
