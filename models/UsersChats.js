const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').init()

const UsersChats = sequelize.define('UsersChats', {
    threadId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    freezeTableName: true, // ✅ No pluralizar automáticamente
    timestamps: false // 👈 Esto evita que Sequelize use createdAt y updatedAt
});

module.exports = UsersChats;