import MessageCaseHandler from './MessageCaseHandler.js';

class SuicideRiskHandler extends MessageCaseHandler {
    matches() { return this.context.hasSuicideRisk === true; }
    async handle() {
        console.log("Detectado riesgo de suicidio");
        if (await this.context.evaluateSuicideRisk(this.context.message) === true) {
            console.log("Confirmado riesgo de suicidio tras evaluación");
            return this.context.suicideRiskDefaultResponse;
        }
    }
}

export default SuicideRiskHandler;

