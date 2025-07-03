import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const UsersEmotionalState = sequelize.define('UsersEmotionalState', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    suicideRiskDetected: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    routineRecomended: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Establece la fecha actual por defecto
    },
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default UsersEmotionalState;
