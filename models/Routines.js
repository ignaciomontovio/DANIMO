// models/Routines.js
import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const Routines = sequelize.define('Routines', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    emotion: {
        type: DataTypes.STRING,
        allowNull: false, // Podés agregar validación según tu modelo TypeEmotion
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false, // El ID del usuario o sistema que la creó
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

export default Routines;