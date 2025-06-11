const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Users, SleepRegisters } = require('../models');
require('./setupTestDB');

describe('Sleep Register Endpoints', () => {
    let token;
    let userId;
    let originalConsoleError;
    let originalConsoleLog;

    before(async () => {
        // Silenciar logs durante tests
        originalConsoleError = console.error;
        console.error = () => {};

        originalConsoleLog = console.log;
        console.log = () => {};

        // Crear un usuario
        const user = await Users.create({
        id: `U-${uuidv4()}`,
        firstName: 'Test',
        lastName: 'User',
        email: 'sleeptest@example.com',
        password: 'Test1234!',
        gender: 'Masculino',
        hasGoogleAccount: false,
        });

        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET);
    });

    after(() => {
        // Restaurar logs originales después de los tests
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('debería insertar un registro de sueño correctamente', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T22:30:00.000Z",
            wake: "2025-05-27T06:30:00.000Z"
        });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('¡Sueño registrado correctamente!');
});

it('no debería insertar si falta bedtime', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            wake: "2025-05-27T06:30:00.000Z"
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"bedtime"');
});

it('no debería insertar si falta wake', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T22:30:00.000Z"
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"wake"');
});

it('no debería insertar si wake es anterior a bedtime', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T23:30:00.000Z",
            wake: "2025-05-26T20:30:00.000Z"
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"wake" debe ser posterior a "bedtime"');
});

it('no debería permitir dos registros de sueño para el mismo día', async () => {
    // Limpiar registros existentes del usuario antes de esta prueba
    await SleepRegisters.destroy({ where: { userId } });

    const sleepData = {
        bedtime: "2025-05-27T01:00:00.000Z", // madrugada del 27
        wake: "2025-05-27T08:00:00.000Z"
    };

    // Primer registro (debería funcionar)
    const firstRes = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send(sleepData);

    expect(firstRes.status).to.equal(200);
    expect(firstRes.body.message).to.equal('¡Sueño registrado correctamente!');

    // Segundo registro el mismo día (debería fallar)
    const secondRes = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-27T22:00:00.000Z",
            wake: "2025-05-28T06:00:00.000Z"
        });

    expect(secondRes.status).to.equal(409);
    expect(secondRes.body.error).to.equal('Ya existe un registro de sueño para hoy.');
});

});
