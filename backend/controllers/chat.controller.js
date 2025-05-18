const { validateChatInput } = require('../utils/validators');
const { chat } = require('../services/chat.service');


exports.chat = async (req, res) => {
    const {error} = validateChatInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        await chat(req.body.message, req.userId);
        res.json({message: '¡Mensaje enviado correctamente!'});
    } catch (err) {
        console.error('❌ Error en /chat:', err);
        return res.status(500).json({error: 'Error al crear mensaje'});
    }
}