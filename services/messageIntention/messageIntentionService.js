const CONTAINS_LINKS_REGEX = '/https?:\/\/[^\s/$.?#].[^\s]*/gi'
const {suicideRiskDetection} = require('./riskDetection')
const {briefResponse} = require('./briefResponse')
const {containsDateReference} = require('./containsDateReference');

exports.validateMessageIntention = (message) => {
    const hasSuicideRisk = suicideRiskDetection(message)
    const containsLinks = CONTAINS_LINKS_REGEX.test(message)
    const isBriefResponse = briefResponse(message)
    const hasADateReference = containsDateReference(message)

    return {hasSuicideRisk, containsLinks, isBriefResponse, hasADateReference}
}