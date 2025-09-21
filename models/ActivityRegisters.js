import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';

const sequelize = init();
const isTestEnv = process.env.NODE_ENV === 'test';

const ActivityRegisters = sequelize.define('ActivityRegisters', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    activityName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluraliza
    timestamps: isTestEnv  // timestamps solo en test
});

export default ActivityRegisters;
