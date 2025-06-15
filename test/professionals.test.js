import request from 'supertest';
import { expect } from 'chai';
import app from '../app';
import './setupTestDB';

describe('Profesionales - Endpoints', () => {
    describe('POST /professionalsAuth/registerProf', () => {
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

        it('debería registrar un profesional nuevo', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'lauraprof@example.com',
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Psicologo',
            });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('¡Profesional registrado correctamente!');
        });

        it('debería rechazar registro sin firstName', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            lastName: 'Gomez',
            email: 'lauraprof2@example.com',
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Psicologo',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El nombre es obligatorio.');
        });

        it('debería rechazar registro sin lastName', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            email: 'lauraprof3@example.com',
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Psiquiatra',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El apellido es obligatorio.');
        });

        it('debería rechazar registro con email inválido', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'noesunmail',
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Psicologo',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('El email no es válido.');
        });

        it('debería rechazar registro con contraseña débil', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'lauraprof4@example.com',
            password: '123',
            gender: 'Femenino',
            profession: 'Psicologo',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.');
        });

        it('debería rechazar registro sin profesion', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'lauraprof5@example.com',
            password: 'Prof3sional!',
            gender: 'Femenino',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.match(/profession/i);
        });

        it('debería rechazar registro con profesion inválido', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'lauraprof6@example.com',
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Dentista',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.match(/profession/i);
        });

        it('debería rechazar registro con profesional que ya existe', async () => {
        const res = await request(app)
            .post('/professionalsAuth/registerProf')
            .send({
            firstName: 'Laura',
            lastName: 'Gomez',
            email: 'lauraprof@example.com', // mismo que el registrado arriba
            password: 'Prof3sional!',
            gender: 'Femenino',
            profession: 'Psicologo',
            });

        expect(res.status).to.equal(500);
        expect(res.body.error).to.equal('Profesional ya existe.');
        });
    });

    describe('POST /professionalsAuth/loginProf', () => {
    it('debería permitir login exitoso', async () => {
        const res = await request(app)
            .post('/professionalsAuth/loginProf')
            .send({
            email: 'lauraprof@example.com',
            password: 'Prof3sional!',
            });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login exitoso');
        });

        it('debería rechazar login con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/professionalsAuth/loginProf')
            .send({
            email: 'lauraprof@example.com',
            password: 'incorrecta',
            });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.match(/contraseña incorrecta/i);
        });
    });
});
