import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init();

const ImportantEvents = sequelize.define('ImportantEvents', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    eventDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventType: {
        type: DataTypes.ENUM('fallecimiento', 'mudanza', 'salud', 'nacimiento', 'aborto', 'necesidades primarias', 'trabajo', 'educación', 'clima'),
        allowNull: false,
    },
    eventDate:{
        type: DataTypes.DATE,
        allowNull: true,
        unique: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default ImportantEvents;
