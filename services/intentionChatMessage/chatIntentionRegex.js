const CONTAINS_LINKS_REGEX = '/https?:\/\/[^\s/$.?#].[^\s]*/gi'
const { suicideRiskDetection } = require('./riskDetectionService')
const { briefResponse } = require('./briefResponse')

exports.validateMessageIntention = (message) => {
    const suicideRisk = suicideRiskDetection(message)
    const containsLinks = CONTAINS_LINKS_REGEX.test(message)
    const briefResponse = briefResponse(message)
}