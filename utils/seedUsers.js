// utils/seedUsers.js
import { v4 as uuidv4 } from 'uuid';
import Users from '../models/Users.js';
import {hashPassword} from "./password.js";

const mockUsers = [
    {
        id: uuidv4(),
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.com',
        password: await hashPassword('password1'),
        hasGoogleAccount: false,
        birthDate: new Date('1996-05-12'),
        gender: 'Femenino',
        occupation: 'Estudiante',
        livesWith: 'Padres',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Martin',
        lastName: 'Lecuona',
        email: 'robertlecuona@gmail.com',
        password: await hashPassword('DNJSSB0rd%'),
        hasGoogleAccount: false,
        birthDate: new Date('1996-05-12'),
        gender: 'Masculino',
        occupation: 'Estudiante',
        livesWith: 'Padres',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Martin',
        lastName: 'Lecuona',
        email: 'lecuonamartin@proton.me',
        password: await hashPassword('CkzQgCzv7^'),
        hasGoogleAccount: false,
        birthDate: new Date('1996-05-12'),
        gender: 'Masculino',
        occupation: 'Estudiante',
        livesWith: 'Padres',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Luis',
        lastName: 'Martínez',
        email: 'luis@example.com',
        password: await hashPassword('password2'),
        hasGoogleAccount: false,
        birthDate: new Date('1992-08-22'),
        gender: 'Masculino',
        occupation: 'Ingeniero',
        livesWith: 'Solo',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Sofía',
        lastName: 'López',
        email: 'sofia@example.com',
        password: await hashPassword('password3'),
        hasGoogleAccount: false,
        birthDate: new Date('1999-11-03'),
        gender: 'Femenino',
        occupation: 'Diseñadora',
        livesWith: 'Pareja',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Carlos',
        lastName: 'Pérez',
        email: 'carlos@example.com',
        password: await hashPassword('password4'),
        hasGoogleAccount: false,
        birthDate: new Date('1984-02-17'),
        gender: 'Masculino',
        occupation: 'Profesor',
        livesWith: 'Familia',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'María',
        lastName: 'Ruiz',
        email: 'maria@example.com',
        password: await hashPassword('password5'),
        hasGoogleAccount: false,
        birthDate: new Date('1989-07-29'),
        gender: 'Femenino',
        occupation: 'Médica',
        livesWith: 'Solo',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Pedro',
        lastName: 'Fernández',
        email: 'pedro@example.com',
        password: await hashPassword('password6'),
        hasGoogleAccount: false,
        birthDate: new Date('1994-12-15'),
        gender: 'Masculino',
        occupation: 'Abogado',
        livesWith: 'Amigos',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Kakaroto',
        lastName: 'Fernández',
        email: 'kakarotofernandez@gmail.com',
        password: await hashPassword('Domingo1?'),
        hasGoogleAccount: false,
        birthDate: new Date('1994-12-15'),
        gender: 'Masculino',
        occupation: 'Programador',
        livesWith: 'Padres',
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Fiodor',
        lastName: 'Gimenez',
        email: 'fiodorgimenez@gmail.com',
        password: await hashPassword('Domingo1?'),
        hasGoogleAccount: false,
        birthDate: new Date('1994-12-15'),
        gender: 'Masculino',
        occupation: 'Diseñador',
        livesWith: null,
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Luiji',
        lastName: 'Gonzalez',
        email: 'luijigon@gmail.com',
        password: await hashPassword('Domingo1?'),
        hasGoogleAccount: false,
        birthDate: new Date('1996-04-15'),
        gender: 'Masculino',
        occupation: 'Freelance',
        livesWith: null,
        profilePic: null,
        firebaseToken: null
    },
    {
        id: uuidv4(),
        firstName: 'Lucas',
        lastName: 'Ramirez',
        email: 'lucasramirez@gmail.com',
        password: await hashPassword('Domingo1?'),
        hasGoogleAccount: false,
        birthDate: new Date('1996-04-15'),
        gender: 'Masculino',
        occupation: 'Freelance',
        livesWith: null,
        profilePic: null,
        firebaseToken: null
    }
];
export default async function seedUsersIfEmpty() {
    for (const user of mockUsers) {
        const exists = await Users.findOne({ where: { email: user.email } });
        if (!exists) {
            await Users.create(user);
        }
    }
}