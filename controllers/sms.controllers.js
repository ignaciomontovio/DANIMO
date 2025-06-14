const { validateSmsSending } = require('../utils/validators');
const service = require('../services/sms.service');

exports.sendMessage = async (req, res) => {
    const { error } = validateSmsSending(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const { to, message } = req.body;
        await service.sendMessage(to, message);
        console.log('✅ SMS enviado con éxito:');
        res.json({ message: 'Sms enviado correctamente' });
    } catch (err) {
        console.error('❌ Error enviando sms:', err);
        return res.status(500).json({ error: 'Error al enviar sms' });
    }
};
