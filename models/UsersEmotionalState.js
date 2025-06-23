import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const UsersEmotionalState = sequelize.define('UsersEmotionalState', {
    suicideRiskDetected: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    routineRecomended: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default UsersEmotionalState;
