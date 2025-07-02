import MessageCaseHandler from './MessageCaseHandler.js';

class ClearHistoryHandler extends MessageCaseHandler {
    matches() { return this.context.clearHistory === true; }
    handle() {
        return this.context.intentaBorrarHistorialDefaultResponse;
    }
}

export default ClearHistoryHandler;

