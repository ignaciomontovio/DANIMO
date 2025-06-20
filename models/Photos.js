import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const Photos = sequelize.define('Photos', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT, // TEXT porque base64 puede ser largo
        allowNull: false,
    },
    emotionName: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default Photos;
