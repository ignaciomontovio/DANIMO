usuario = require('models.Usuario');

Usuario.associate = (models) => {
    Usuario.belongsTo(models.Profesional, { foreignKey: 'profesionalId' });
};