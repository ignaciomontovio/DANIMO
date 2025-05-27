const express = require('express');
const router = express.Router();
const controller = require('../controllers/activities.controller');
const middleware = require('../middleware/middleware'); // importar el middleware

router.post('/entry', middleware, controller.createActivityRegister);
router.get('/types', controller.getTypeActivities);


module.exports = router;