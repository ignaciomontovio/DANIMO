import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init()

const Conversations = sequelize.define('Conversations', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    summaryAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    messageDate: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default Conversations;
