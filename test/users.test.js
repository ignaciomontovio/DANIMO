const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
require('./setupTestDB'); // Importa el setup

describe('Usuarios - Endpoints', () => {
    describe('POST /auth/register', () => {
        let originalConsoleError;

        before(() => {
            originalConsoleError = console.error;
            // Reemplazamos console.error por función vacía para silenciarlo
            console.error = () => {};
        });

        after(() => {
            // Restauramos console.error después de los tests
            console.error = originalConsoleError;
        });

        //TESTEO EL REGISTRO DE UN NUEVO USUARIO
        it('debería registrar un usuario nuevo', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanprueba@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        //Para ver si salió bien, comparo lo que me devuelve el servidor contra la respuesta esperada
        //Se podrían sacar los mensajes, por ahora los dejo para que de mas info
        //El mensaje tiene que coincidir, sino el test sale mal aunque el res.status sea el mismo    
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('¡Usuario registrado correctamente!');
        });

        //TESTEO QUE NO PUEDO REGISTRAR DOS VECES EL MISMO USUARIO
        it('debería rechazar registro con usuario que ya existe', async () => {
        // Primero registramos el usuario
        /* 
            QUE LA PRUEBA DE REGISTRAR UN USUARIO ESTE DEFINIDA ANTES EN EL CODIGO 
            NO QUIERE DECIR QUE SE VA A EJECUTAR SIEMPRE ANTES. 
            POR ESO, ANTES DE PROBAR REGISTRAR DE NUEVO UN USUARIO EXISTENTE, TENGO QUE INSERTAR UNO MANUALMENTE
        */

        await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanrepetido@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        // Intentamos registrar de nuevo con el mismo email
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanrepetido@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });
        
        expect(res.status).to.equal(500);
        expect(res.body.error).to.equal('Usuario ya existe.');
        });

        //TESTEO QUE NO PUEDO REGISTRAR SIN MAIL
        it('debería rechazar registro sin email', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        //Se podrían sacar los mensajes, por ahora los dejo para que de mas info
        //El mensaje tiene que coincidir, sino el test sale mal aunque el res.status sea el mismo 
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El email es obligatorio.');
        });

        //TESTEO QUE NO PUEDO REGISTRAR SIN NOMBRE
        it('debería rechazar registro sin firstName', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            lastName: 'Perez',
            email: 'sinfirstname@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El nombre es obligatorio.');
        });

        //TESTEO QUE NO PUEDO REGISTRAR SIN APELLIDO
        it('debería rechazar registro sin lastName', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            email: 'sinlastname@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El apellido es obligatorio.');
        });

        //TESTEO QUE NO PUEDO REGISTRAR SI EL EMAIL NO ES VALIDO
        it('debería rechazar registro con email inválido', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'noesunmail',
            password: 'Passw0rd!',
            gender: 'Masculino',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El email no es válido.');
        });

        //TESTEO QUE NO PUEDO REGISTRAR SI LA PASSWORD NO CUMPLE LAS VALIDACIONES
        it('debería rechazar registro con password insegura', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'passwordinsegura@example.com',
            password: '12345678',
            gender: 'Masculino',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.');
        });
    });

    describe('POST /auth/login', () => {
    before(async () => {
        // Registrar usuario para login exitoso
        /* 
            QUE LA PRUEBA DE REGISTRAR UN USUARIO ESTE DEFINIDA ANTES QUE LA DE LOGIN EN EL CODIGO 
            NO QUIERE DECIR QUE SE VA A EJECUTAR SIEMPRE ANTES. 
            POR ESO, ANTES DE PROBAR UN LOGIN, INSERTO UN USUARIO EN LA BASE DE DATOS PARA ASEGURARME
            QUE TENGO UN REGISTRO Y PUEDA HACER EL LOGIN. DE LO CONTRARIO, ME ARRIESGO A QUE FALLE
        */
        await request(app)
        .post('/auth/register')
        .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanlogin@example.com',
            password: 'Passw0rd!',
            gender: 'Masculino',
        });
    });

    //TESTEO QUE NO PUEDO LOGUEARME CON CONTRASEÑA INCORRECTA
    it('debería rechazar login con contraseña incorrecta', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({
            email: 'juanlogin@example.com',
            password: 'incorrecta',
        });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.match(/contraseña incorrecta/i);
    });

    //TESTEO QUE PUEDA LOGUEARME CON LA PASSWORD CORRECTA
    it('debería permitir login exitoso', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({
            email: 'juanlogin@example.com',
            password: 'Passw0rd!',
        });

        //console.log(res.body.message)
        //console.log(res.body.token)
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login completado con éxito');
    });
    });
});
