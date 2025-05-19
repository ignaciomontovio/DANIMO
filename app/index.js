const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usersRoutes = require('../routes/users.routes');
const professionalsRoutes = require('../routes/professionals.routes');
const activity = require('../routes/activities.routers');
const daily = require('../routes/registers.routers');
const emotion = require('../routes/emotions.routers');
const sleep = require('../routes/sleeps.routers');
const contact = require('../routes/contacts.routers');
const chat = require('../routes/chat.routes');

//const apiRoutes = require('../routes/api.routes');
//const chatRoutes = require('../routes/chat.routes');

app.use('/auth', usersRoutes);
app.use('/professionalsAuth', professionalsRoutes);
//app.use('/api', apiRoutes);
//app.use('/api', chatRoutes);

app.use('/activity', activity)
app.use('/daily', daily)
app.use('/emotion', emotion)
app.use('/sleep', sleep)
app.use('/contact', contact)
app.use('/dani', chat)

module.exports = app;
