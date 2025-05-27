const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Users, DailyRegisters, SleepRegisters } = require('../models');
require('./setupTestDB');

describe('Sleep Register Endpoints', () => {
    let token;
    let userId;
    let dailyRegisterId;
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

        // Crear un registro diario para hoy
        const today = new Date();
        dailyRegisterId = `D-${uuidv4()}`;
        await DailyRegisters.create({
        id: dailyRegisterId,
        date: today,
        userId: userId,
        });
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
            wake: "2025-05-27T06:30:00.000Z",
            quality: 4
        });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('¡Sueño registrado correctamente!');
});

it('no debería insertar si falta bedtime', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            wake: "2025-05-27T06:30:00.000Z",
            quality: 4
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"bedtime"');
});

it('no debería insertar si falta wake', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T22:30:00.000Z",
            quality: 4
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"wake"');
});

it('no debería insertar si falta quality', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T22:30:00.000Z",
            wake: "2025-05-27T06:30:00.000Z"
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"quality"');
});

it('no debería insertar si wake es anterior a bedtime', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T23:30:00.000Z",
            wake: "2025-05-26T20:30:00.000Z",
            quality: 3
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"wake" debe ser posterior a "bedtime"');
});

it('no debería insertar si no hay registro diario para el día', async () => {
    const anotherUser = await Users.create({
        id: `U-${uuidv4()}`,
        firstName: 'NoDaily',
        lastName: 'User',
        email: 'nodaily@example.com',
        password: 'Test1234!',
        gender: 'Femenino',
        hasGoogleAccount: false,
    });

    const anotherToken = jwt.sign({ userId: anotherUser.id }, process.env.JWT_SECRET);

    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({
            bedtime: "2025-05-26T22:30:00.000Z",
            wake: "2025-05-27T06:30:00.000Z",
            quality: 4
        });

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No hay un registro diario para hoy.');
});

it('no debería insertar si ya existe un registro de sueño para hoy', async () => {
    const res = await request(app)
        .post('/sleep/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
            bedtime: "2025-05-26T23:00:00.000Z",
            wake: "2025-05-27T07:00:00.000Z",
            quality: 5
        });

    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('Error al registrar sueño');
});
});
