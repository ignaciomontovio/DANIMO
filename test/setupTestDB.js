const { init } = require('../config/database');

// Declara una variable sequelize a nivel del archivo para que pueda ser usada en los hooks before y after, 
// y exportada si hace falta.
let sequelize;

// before() es un hook global de Mocha que se ejecuta una vez antes de todos los tests.
before(async function () {
    // Establece variables de entorno necesarias para los tests
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'your_jwt_secret';

    //Inicializa la base de datos llamando a init()
    sequelize = init();

    // Usa sequelize.sync({ force: true }) para
    /*
        Sincronizar todos los modelos con la base de datos.
        force: true elimina todas las tablas existentes y las vuelve a crear desde cero (ideal para tests limpios)
    */
    await sequelize.sync({ force: true });
});

// after() es otro hook de Mocha que se ejecuta una vez después de todos los tests
// Cierra la conexión de Sequelize si existe, liberando los recursos y evitando conexiones colgantes.
after(async function () {
    if (sequelize) await sequelize.close();
});

// Exporta una función getSequelize() que permite acceder a la instancia de Sequelize desde otros archivos si se necesita
module.exports = {
    getSequelize: () => sequelize,
};
