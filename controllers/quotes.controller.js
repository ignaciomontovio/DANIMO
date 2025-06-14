const { validateQuoteInput } = require('../utils/validators');
const service = require('../services/quotes.service');

exports.getQuote = async (req, res) => {
    const {error} = validateQuoteInput(req.body);
    if (error) {
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