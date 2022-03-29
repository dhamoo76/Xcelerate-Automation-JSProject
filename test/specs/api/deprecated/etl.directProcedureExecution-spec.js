const expect = require('chai').expect;
const statusCode = require('../../../constants/status-code')
const invalidData = require('../../../data/config').invalidData

const DirectProcedureExecutionAPI = require('../../../src/api/etl.directProcedureExecutionAPI')
const PayloadDefinitionsAPI = require('../../../src/api/etl.payloadDefinitionsAPI')
const Utilities = require('../api/utilities/utilities')
let utils = new Utilities()

describe('/directprocedureexecution verification', () => {

  let request = new DirectProcedureExecutionAPI()
  let request_payloads = new PayloadDefinitionsAPI()
  let randomPayload

  describe('Check /prepareuris PUT endpoint', () => {
    it('233397 - 1 | Send all required files for specific payload definition #smoke', async () => {
      randomPayload = await request_payloads.getRandomPayloadDefinitionWithProcedures()
      let requestBody = utils.generatePrepareUrisBody(randomPayload)

      let response = await request.putPrepareUris(requestBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.verifyPrepareUrisResponse(response.body.uploadUrls, requestBody)
    });

    it('233397 - 2 | Send one required file for specific payload definition', async () => {
      let requestBody = { 
        protocolId: randomPayload.protocolId, 
        fileNames: [ randomPayload.procedures[0].files[0].pattern ] 
      }

      let response = await request.putPrepareUris(requestBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.verifyPrepareUrisResponse(response.body.uploadUrls, requestBody)
    });

    it('233397 - 3 | Send empty file table for specific payload definition', async () => {
      let requestBody = { 
        protocolId: randomPayload.protocolId, 
        fileNames: [] 
      }

      let response = await request.putPrepareUris(requestBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('233398 | Send files for not existing payload definition', async () => {
      let requestBody = { 
        protocolId: invalidData.notExistingProtocolId, 
        fileNames: [ randomPayload.procedures[0].files[0].pattern ] 
      }

      let response = await request.putPrepareUris(requestBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.verifyPrepareUrisResponse(response.body.uploadUrls, requestBody)
    });

    it('233399 | Send files without payload definition field', async () => {
      let requestBody = {
        fileNames: [ randomPayload.procedures[0].files[0].pattern ] 
      }

      let response = await request.putPrepareUris(requestBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });
  });
});