import MessageCaseHandler from './MessageCaseHandler.js';

class DateReferenceHandler extends MessageCaseHandler {
    matches() { return this.context.hasADateReference === true; }
    handle() {
        console.log("El mensaje contiene una referencia a una fecha");
        this.context.evaluateDateReference(this.context.message);
    }
}

export default DateReferenceHandler;

