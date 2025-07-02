class MessageCaseHandler {
    constructor(context) {
        this.context = context;
    }
    matches() { return false; }
    async handle() { return undefined; }
}

export default MessageCaseHandler;

