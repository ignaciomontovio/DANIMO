// chatgptConversation.js

const axios = require('axios');
const promptFile = require('prompt')

class ChatGPTConversation {
    constructor(apiKey, systemPrompt = promptFile.prompt) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4'; // O usa 'gpt-3.5-turbo' si prefieres
        this.messages = [
            { role: 'system', content: systemPrompt }
        ];
    }

    async sendMessage(userInput) {
        // Agrega mensaje del usuario
        this.messages.push({ role: 'user', content: userInput });

        try {
            const response = await axios.post(this.apiUrl, {
                model: this.model,
                messages: this.messages
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const reply = response.data.choices[0].message.content;

            // Guarda la respuesta del asistente en el historial
            this.messages.push({ role: 'assistant', content: reply });

            return reply;
        } catch (error) {
            console.error("Error al enviar mensaje a ChatGPT:", error.response?.data || error.message);
            throw new Error("Fallo al comunicarse con la API de OpenAI.");
        }
    }

    resetConversation(newSystemPrompt = null) {
        // Reinicia el historial manteniendo o cambiando el prompt del sistema
        const prompt = newSystemPrompt || this.messages.find(msg => msg.role === 'system').content;
        this.messages = [
            { role: 'system', content: prompt }
        ];
    }

    getHistory() {
        return this.messages;
    }
}

module.exports = ChatGPTConversation;
