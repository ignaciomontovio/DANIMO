import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const MoodAlternators = sequelize.define('MoodAlternators', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
    //COMPLETAR MAS CAMPOS O CREAR NUEVAS CLASES
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default MoodAlternators;
