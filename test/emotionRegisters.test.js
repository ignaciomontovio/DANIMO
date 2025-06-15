import request from 'supertest';
import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import app from '../app';
import { Users, DailyRegisters, EmotionRegisters } from '../models';
import './setupTestDB';

describe('Emociones - Endpoints', () => {
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
    firstName: 'Emotion',
    lastName: 'Tester',
    email: 'emotiontest@example.com',
    password: 'Test1234!',
    gender: 'Masculino',
    hasGoogleAccount: false,
    });
    userId = user.id;
    token = jwt.sign({ userId }, process.env.JWT_SECRET);

    // Crear registro diario para hoy
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

//Destruyo las emociones insertadas entre pruebas para que la predominante no dependa de cual ejecuto primero
beforeEach(async () => {
    await EmotionRegisters.destroy({ where: {} });
});


  // POST /emotion/entry
describe('POST /emotion/entry', () => {
    it('debería registrar una emoción correctamente', async () => {
    const res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Alegria',
        intensity: 7,
        isPredominant: true,
        });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('¡Emocion registrada correctamente!');
    });

    it('debería fallar si falta el campo emotion', async () => {
    const res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        intensity: 5,
        isPredominant: false,
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"emotion"');
    });

    it('debería fallar si falta el campo intensity', async () => {
    const res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Tristeza',
        isPredominant: false,
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"intensity"');
    });

    it('debería fallar si falta el campo isPredominant', async () => {
    const res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Ira',
        intensity: 3,
        });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('"isPredominant"');
    });

    it('debería registrar más de una emoción para el mismo dailyRegisterId', async () => {
      // Primero con isPredominant: false
    let res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Miedo',
        intensity: 6,
        isPredominant: false,
        });

    expect(res.status).to.equal(200);

      // Luego con isPredominant: true
    res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Sorpresa',
        intensity: 8,
        isPredominant: true,
        });

    expect(res.status).to.equal(200);
    });

    it('debería actualizar isPredominant correctamente', async () => {

    //await EmotionRegisters.destroy({ where: {} });

      // Primera emoción predominante
    let res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Confianza',
        intensity: 7,
        isPredominant: true,
        });

    expect(res.status).to.equal(200);

      // Segunda predominante (debe reemplazar la anterior)
    res = await request(app)
        .post('/emotion/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
        emotion: 'Asco',
        intensity: 4,
        isPredominant: true,
        });

    expect(res.status).to.equal(200);

    const emotions = await EmotionRegisters.findAll({
        where: { dailyRegisterId },
        order: [['createdAt', 'ASC']], //Requiero las timestamps para el entorno de test
    });

    const predominantCount = emotions.filter(e => e.isPredominant).length;
    expect(predominantCount).to.equal(1);
    expect(emotions[emotions.length - 1].emotion).to.equal('Asco');
    });
});

  // GET /emotion/predominant
describe('GET /emotion/predominant', () => {
    it('debería obtener la emoción predominante correctamente', async () => {
    // Limpiar emociones anteriores explícitamente
    await EmotionRegisters.destroy({ where: {} });
    
        // Insertar directamente en DB
    await EmotionRegisters.create({
        id: `U-${uuidv4()}`,
        emotion: 'Alegria',
        intensity: 5,
        isPredominant: true,
        dailyRegisterId,
    });

    const res = await request(app)
        .get('/emotion/predominant')
        .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Emocion predominante');
    expect(res.body.emotion).to.include({
        emotion: 'Alegria',
        intensity: 5,
        isPredominant: true,
        dailyRegisterId,
    });
    });
});
});
