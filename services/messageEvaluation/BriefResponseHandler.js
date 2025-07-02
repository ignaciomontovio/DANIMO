import MessageCaseHandler from './MessageCaseHandler.js';

class BriefResponseHandler extends MessageCaseHandler {
    matches() { return this.context.isBriefResponse === true; }
    handle() {
        console.log("El mensaje es una respuesta breve");
        this.context.setPrompt(this.context.briefResponsePrompt);
    }
}

export default BriefResponseHandler;

