const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('./setupTestDB'); // Importa el setup global

describe('Daily Register Endpoints', () => {
    let token;
    let userId;

    let originalConsoleError;
    let originalConsoleLog;

    before(() => {
        originalConsoleError = console.error;
        // Reemplazamos console.error por función vacía para silenciarlo
        console.error = () => {};

        originalConsoleLog = console.log;
        // Reemplazamos console.log por función vacía para silenciarlo
        console.log = () => {}; // silencia console.log
    });

    after(() => {
        // Restauramos console.error después de los tests
        console.error = originalConsoleError;

        // Restauramos console.log después de los tests
        console.log = originalConsoleLog; 
    });

    before(async () => {
        // Crear un usuario válido
        const user = await Users.create({
        id: `U-${uuidv4()}`,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test1234!',
        gender: 'Masculino',
        hasGoogleAccount: false
        });

        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET);
    });

    it('debería crear un registro diario exitosamente', async () => {
        const res = await request(app)
        .post('/daily/create')
        .set('Authorization', `Bearer ${token}`);

        //console.log(res.body.message);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('¡Registro diario creado correctamente!');
    });

    it('debería fallar al intentar crear un segundo registro en la misma fecha', async () => {
        const res = await request(app)
        .post('/daily/create')
        .set('Authorization', `Bearer ${token}`);

        //console.log(res.body.error);
        expect(res.status).to.equal(500); // O 400 si decidís cambiarlo por validación más precisa
        expect(res.body.error).to.equal('Error al cargar registro diario');
    });
});
