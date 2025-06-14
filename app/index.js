const express = require('express');
const cors = require('cors');
/*
Comento cookie parser por ahora
*/
//const cookieParser = require('cookie-parser'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
//app.use(cookieParser()); // lo necesito para poder parsear cookies

// Rutas
const usersRoutes = require('../routes/users.routes');
const professionalsRoutes = require('../routes/professionals.routes');
const activity = require('../routes/activities.routers');
const emotion = require('../routes/emotions.routers');
const sleep = require('../routes/sleeps.routers');
const contact = require('../routes/contacts.routers');
const chat = require('../routes/chat.routes');
const quote = require('../routes/quotes.routers');
const sms = require('../routes/sms.routers');
const medication = require('../routes/medications.routers')

app.use('/auth', usersRoutes);
app.use('/professionalsAuth', professionalsRoutes);
app.use('/activity', activity)
app.use('/emotion', emotion)
app.use('/sleep', sleep)
app.use('/contact', contact),
app.use('/quote',quote),
app.use('/dani', chat)
app.use('/sms', sms),
app.use('/medication',medication)

module.exports = app;
