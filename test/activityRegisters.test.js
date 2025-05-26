const request = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Users, DailyRegisters, ActivityRegisters } = require('../models');
require('./setupTestDB');

describe('Activity Register Endpoints', () => {
    let token;
    let userId;
    let dailyRegisterId;
    let originalConsoleError;
    let originalConsoleLog;

    before(async () => {
    // Silenciar logs
    originalConsoleError = console.error;
    console.error = () => {};
    originalConsoleLog = console.log;
    console.log = () => {};

    // Crear usuario
    const user = await Users.create({
        id: `U-${uuidv4()}`,
        firstName: 'Activity',
        lastName: 'Tester',
        email: 'activity@example.com',
        password: 'Test1234!',
        gender: 'Masculino',
        hasGoogleAccount: false,
    });

    userId = user.id;
    token = jwt.sign({ userId }, process.env.JWT_SECRET);

    // Crear registro diario
    const today = new Date();
    dailyRegisterId = `D-${uuidv4()}`;
    await DailyRegisters.create({
        id: dailyRegisterId,
        date: today,
        userId: userId,
    });
});

after(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
});

it('debería registrar una actividad correctamente', async () => {
    const res = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Estudiar Matemática',
        category: 'Estudio',
        date: new Date(),
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('¡Actividad registrada correctamente!');
});

it('no debería registrar si falta category', async () => {
    const res = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Hacer limpieza',
        date: new Date(),
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"category"');
});

it('no debería registrar si falta date', async () => {
    const res = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Pintar',
        category: 'Hobby',
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"date"');
});

it('no debería registrar si falta name', async () => {
    const res = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        category: 'Trabajo',
        date: new Date(),
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"name"');
});

it('debería permitir múltiples actividades en el mismo dailyRegisterId', async () => {
    const res1 = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Reunión de equipo',
        category: 'Trabajo',
        date: new Date(),
    });

    const res2 = await request(app)
    .post('/activity/entry')
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'Tareas del hogar',
        category: 'Hogar',
        date: new Date(),
    });

    expect(res1.status).to.equal(200);
    expect(res2.status).to.equal(200);
    expect(res1.body.message).to.equal('¡Actividad registrada correctamente!');
    expect(res2.body.message).to.equal('¡Actividad registrada correctamente!');
});
});
