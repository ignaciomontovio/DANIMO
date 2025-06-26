import express from 'express';
import cors from 'cors';
import '../cron/medicationChecker.js';
/*
Comento cookie parser por ahora
*/
// import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(cookieParser()); // lo necesito para poder parsear cookies

// Rutas
import usersRoutes from '../routes/users.routes.js';
import professionalsRoutes from '../routes/professionals.routes.js';
import activity from '../routes/activities.routers.js';
import emotion from '../routes/emotions.routers.js';
import sleep from '../routes/sleeps.routers.js';
import contact from '../routes/contacts.routers.js';
import chat from '../routes/chat.routes.js';
import quote from '../routes/quotes.routers.js';
import sms from '../routes/sms.routers.js';
import medication from '../routes/medications.routers.js';
import notification from '../routes/notifications.routers.js';

app.use('/auth', usersRoutes);
app.use('/professionalsAuth', professionalsRoutes);
app.use('/activity', activity)
app.use('/emotion', emotion)
app.use('/sleep', sleep)
app.use('/contact', contact)
app.use('/quote',quote)
app.use('/dani', chat)
app.use('/sms', sms)
app.use('/medication',medication)
app.use('/notification',notification)

export default app;
