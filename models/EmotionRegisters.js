import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const isTestEnv = process.env.NODE_ENV === 'test';

const EmotionRegisters = sequelize.define('EmotionRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isPredominant: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    emotionName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: isTestEnv // Que cree las timestamps en el entorno de test
});

export default EmotionRegisters;
