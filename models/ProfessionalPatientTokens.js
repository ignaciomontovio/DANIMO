import { DataTypes } from 'sequelize';
import { init } from '../config/database.js';
const sequelize = init()

const ProfessionalPatientTokens = sequelize.define('ProfessionalPatientTokens', {
    tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

export default ProfessionalPatientTokens;
