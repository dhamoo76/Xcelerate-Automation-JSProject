const ProcessFileAPI = require('../../../../src/api/etl.processfileAPI')
const PayloadDefinitionsAPI = require('../../../../src/api/etl.payloadDefinitionsAPI')
const Utilities = require('../utilities/utilities');
const statusCode = require('../../../../constants/status-code');
const expect = require('chai').expect;

let utils = new Utilities()

describe('/processFile verification', () => {

    let request = new ProcessFileAPI()
    let request_payloads = new PayloadDefinitionsAPI()
    let protocolId
    let fileName
    let fileLocation

    //@TODO 
    // skipped this test case for now - it will consume too much time
    // it('191642 - 1 | Match Incoming Data File to Payload Definition - Full Match #smoke', async () => {
        // let randomPayload = await request_payloads.getRandomPayloadDefinition()
        // protocolId = randomPayload.protocolId
        // fileName = randomPayload.files[0].pattern
        // fileLocation = randomPayload.files[0].schemaName
    // });

    it('191642 - 2 | Match Incoming Data File to Payload Definition - Partial Match #smoke', async () => {
        let randomPayload = await request_payloads.getRandomPayloadDefinitionWithFiles()
        protocolId = randomPayload.protocolId
        console.log(JSON.stringify(randomPayload))
        fileName = randomPayload.procedures[0].files[0].pattern
        fileLocation = randomPayload.procedures[0].files[0].schemaName

        let response = await request.postProcessFile(protocolId, fileName, fileLocation)
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utils.verifyPartialMatchesTable(response, randomPayload)
    });

    it('191642 - 3 | Match Incoming Data File to Payload Definition - No Match #smoke', async () => {
        let randomPayload = await request_payloads.getRandomPayloadDefinitionWithFiles()
        protocolId = randomPayload.protocolId
        fileName = randomPayload.procedures[0].files[0].pattern + '123'
        fileLocation = randomPayload.procedures[0].files[0].schemaName

        let response = await request.postProcessFile(protocolId, fileName, fileLocation)
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        expect(response.body.completeMatches, "Complete matches table is not empty: " + response.body).to.be.empty
        expect(response.body.partialMatches, "Partial matches table is not empty: " + response.body).to.be.empty
      });
  });