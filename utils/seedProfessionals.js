// utils/seedProfessionals.js
import { v4 as uuidv4 } from 'uuid';
import Professionals from '../models/Professionals.js';
import {hashPassword} from "./password.js";

const mockProfessionals = [
    {
        id: uuidv4(),
        dni: 12345678,
        firstName: 'Laura',
        lastName: 'Gómez',
        email: 'laura.pro@example.com',
        password: await hashPassword('profpass1'),
        hasGoogleAccount: false,
        birthDate: new Date('1980-03-15'),
        gender: 'Femenino',
        occupation: 'Psicóloga',
        livesWith: 'Pareja',
        profilePic: null,
        license: 'PSY1234',
        authorized: true
    },
    {
        id: uuidv4(),
        dni: 23456789,
        firstName: 'Javier',
        lastName: 'Sánchez',
        email: 'javier.pro@example.com',
        password: await hashPassword('profpass2'),
        hasGoogleAccount: false,
        birthDate: new Date('1975-07-22'),
        gender: 'Masculino',
        occupation: 'Psiquiatra',
        livesWith: 'Solo',
        profilePic: null,
        license: 'PSY2345',
        authorized: true
    },
    {
        id: uuidv4(),
        dni: 34567890,
        firstName: 'Marta',
        lastName: 'Fernández',
        email: 'marta.pro@example.com',
        password: await hashPassword('profpass3'),
        hasGoogleAccount: false,
        birthDate: new Date('1985-11-30'),
        gender: 'Femenino',
        occupation: 'Psicopedagoga',
        livesWith: 'Familia',
        profilePic: null,
        license: 'PSY3456',
        authorized: false
    },
    {
        id: uuidv4(),
        dni: 45678901,
        firstName: 'Pablo',
        lastName: 'López',
        email: 'pablo.pro@example.com',
        password: await hashPassword('profpass4'),
        hasGoogleAccount: false,
        birthDate: new Date('1990-01-10'),
        gender: 'Masculino',
        occupation: 'Terapeuta',
        livesWith: 'Padres',
        profilePic: null,
        license: 'PSY4567',
        authorized: true
    },
    {
        id: uuidv4(),
        dni: 56789012,
        firstName: 'Lucía',
        lastName: 'Martínez',
        email: 'lucia.pro@example.com',
        password: await hashPassword('profpass5'),
        hasGoogleAccount: false,
        birthDate: new Date('1988-06-18'),
        gender: 'Femenino',
        occupation: 'Coach',
        livesWith: 'Solo',
        profilePic: null,
        license: 'PSY5678',
        authorized: false
    },
    {
        id: uuidv4(),
        dni: 67890123,
        firstName: 'Andrés',
        lastName: 'Ruiz',
        email: 'andres.pro@example.com',
        password: await hashPassword('profpass6'),
        hasGoogleAccount: false,
        birthDate: new Date('1982-09-25'),
        gender: 'Masculino',
        occupation: 'Psicólogo',
        livesWith: 'Amigos',
        profilePic: null,
        license: 'PSY6789',
        authorized: true
    },
    {
        id: uuidv4(),
        dni: 23490123,
        firstName: 'Martin',
        lastName: 'Lecuona',
        email: 'robertlecuona@gmail.com',
        password: await hashPassword('DNJSSB0rd%'),
        hasGoogleAccount: false,
        birthDate: new Date('1982-09-25'),
        gender: 'Masculino',
        occupation: 'Psicólogo',
        livesWith: 'Amigos',
        profilePic: null,
        license: 'EFE6789',
        authorized: true
    },
    {
        id: uuidv4(),
        dni: 654390123,
        firstName: 'Martin',
        lastName: 'Lecuona',
        email: 'lecuonamartin@proton.me',
        password: await hashPassword('CkzQgCzv7^'),
        hasGoogleAccount: false,
        birthDate: new Date('1982-09-25'),
        gender: 'Masculino',
        occupation: 'Psicólogo',
        livesWith: 'Amigos',
        profilePic: null,
        license: 'EEA6789',
        authorized: true
    }
];

export default async function seedProfessionalsIfEmpty() {
    for (const professional of mockProfessionals) {
        const exists = await Professionals.findOne({ where: { email: professional.email } });
        if (!exists) {
            await Professionals.create(professional);
        }
    }
}