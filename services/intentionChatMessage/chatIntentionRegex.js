const CONTAINS_LINKS_REGEX = '/https?:\/\/[^\s/$.?#].[^\s]*/gi'
const {suicideRiskDetection} = require('./riskDetectionService')
const {briefResponse} = require('./briefResponse')
const {containsDateReference} = require('./containsDateReference');

exports.validateMessageIntention = (message) => {
    const suicideRisk = suicideRiskDetection(message)
    const containsLinks = CONTAINS_LINKS_REGEX.test(message)
    const briefResponse = briefResponse(message)
    const containsDateReference = containsDateReference(message)

    return {suicideRisk, containsLinks, briefResponse, containsDateReference}
}