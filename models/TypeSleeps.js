import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';

const sequelize = init();

const TypeSleeps = sequelize.define('TypeSleeps', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true // 👉 name como PK
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true, // ✅ evita plural automático
    timestamps: false // 👈 sin createdAt / updatedAt
});

export default TypeSleeps;
