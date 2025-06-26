import express from 'express';
import * as controller from '../controllers/quotes.controller.js';

const router = express.Router();

router.get('/obtain', controller.getQuote);
router.get('/daily', controller.getDailyQuote);

export default router;
