const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const RecoveryTokens = sequelize.define('RecoveryTokens', {
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

module.exports = RecoveryTokens;