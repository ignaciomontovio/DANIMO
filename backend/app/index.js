const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usersRoutes = require('../routes/users.routes');
const professionalsRoutes = require('../routes/professionals.routes');
//const apiRoutes = require('../routes/api.routes');
//const chatRoutes = require('../routes/chat.routes');

app.use('/auth', usersRoutes);
app.use('/professionalsAuth', professionalsRoutes);
//app.use('/api', apiRoutes);
//app.use('/api', chatRoutes);

module.exports = app;
