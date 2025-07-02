import MessageCaseHandler from './MessageCaseHandler.js';

class ImportantDatesNearbyHandler extends MessageCaseHandler {
    matches() { return this.context.importantDatesNearby.length > 0; }
    handle() {
        console.log("Hay fechas importantes cercanas");
    }
}

export default ImportantDatesNearbyHandler;

