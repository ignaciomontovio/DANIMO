import MessageCaseHandler from './MessageCaseHandler.js';

class ContainsLinksHandler extends MessageCaseHandler {
    matches() { return this.context.containsLinks === true; }
    handle() {
        console.log("El mensaje contiene enlaces");
        return this.context.containsLinksResponse;
    }
}

export default ContainsLinksHandler;

