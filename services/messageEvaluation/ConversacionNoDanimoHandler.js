import MessageCaseHandler from './MessageCaseHandler.js';

class ConversacionNoDanimoHandler extends MessageCaseHandler {
    matches() { return true; }
    async handle() {
        console.log("Evaluando intención del usuario");
        const { conversacionNoDanimo } = await this.context.userIntentMessage(this.context.message);
        if (conversacionNoDanimo === true) {
            console.log("El usuario expresa no tener ánimo para conversar");
            return this.context.conversacionNoDanimoDefaultResponse;
        }
    }
}

export default ConversacionNoDanimoHandler;

