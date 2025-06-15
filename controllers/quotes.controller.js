import { validateQuoteInput } from '../utils/validators.js';
import * as service from '../services/quotes.service.js';

export const getQuote = async (req, res) => {
    const {error} = validateQuoteInput(req.body);
    if (error) {
        console.error("❌ Error in joi validation Error:" + error.details[0].message)
        return res.status(400).json({error: error.details[0].message});
    }
    try { 
        const quote = await service.getQuote(req.body.id);
        console.log('✅ Frases cargadas existosamente ');
        res.json(quote);
    } catch (err) {
        console.error('❌ Error al obtener frase:', err.message);
        res.status(500).json({ error: 'No se pudo obtener una frase' });
    }
};