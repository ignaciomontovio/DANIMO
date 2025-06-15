continua
import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const TypeActivities = sequelize.define('TypeActivities', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true  // 👈 clave primaria
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default TypeActivities;
