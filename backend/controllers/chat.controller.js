const { validateChatInput } = require('../utils/validators');
const { chat } = require('../services/chat.service');


exports.chat = async (req, res) => {
    const {error} = validateChatInput(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const {message} = req.body;
        const response = await chat({message: message, userId: req.userId});
        res.json({message: response});
    } catch (err) {
        console.error('❌ Error en /chat:', err);
        return res.status(500).json({error: 'Error al crear mensaje'});
    }
}