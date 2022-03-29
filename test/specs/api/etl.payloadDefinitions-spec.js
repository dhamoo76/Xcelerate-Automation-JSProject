const expect = require('chai').expect;
const data = require('../../../data/payloadDefinitions')
const data_protocol = require('../../../data/protocols')
const statusCode = require('../../../constants/status-code')

const PayloadDefinitionsAPI = require('../../../src/api/etl.payloadDefinitionsAPI');
const ProtocolsAPI = require('../../../src/api/etl.protocolsAPI');
const ProceduresAPI = require('../../../src/api/etl.proceduresAPI');
const ClientsAPI = require('../../../src/api/cem.clientsAPI');
const ProtocolTypesAPI = require('../../../src/api/etl.protocolTypesAPI.js');
const timestamp = Date.now();
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe(' /payloaddefinitions with filtering verification', () => {

  const invalidId = data.regression.invalidId;
  let correctParameters = data.regression.correctParameters;

  const fieldsNull = data.regression.fieldsNull;
  const longValues = data.regression.longValues;
  const invalid = data.regression.invalid;
  let payloadDefinitionId;
  let mdmClientId

  let request = new PayloadDefinitionsAPI();
  let request_protocols = new ProtocolsAPI();
  let request_procedures = new ProceduresAPI();
  let request_client = new ClientsAPI();
  let request_protocol_type = new ProtocolTypesAPI()

  before( async() => {
    mdmClientId = await request_client.getRandomClientId()
  });


  describe('Empty Filter', () => {
    it('191648 | /GET /payloaddefinitions (without filtering)', async () => {
      let response = await request.getPayloadDefinitions();

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllPayloadDefinitionsFields(response.body.results);
    });
  });

  describe('Filter by clientId', () => {
    it('207448 | (191648-3) /GET /payloaddefinitions filter by valid client id #smoke', async () => {
      let getRandomProtocolId = await request.getRandomProtocolId();
      let validProtocolId = await request_protocols.getProtocolsByProtocolId(getRandomProtocolId);
      let validClientId = validProtocolId.body.mdmClientId;

      let response = await request.getPayloadDefinitionsByClientId(validClientId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllPayloadDefinitionsFields(response.body.results);
    });

    it('191648 - 6 | /GET /payloaddefinitions filter by empty client id', async () => {
      let response = await request.getPayloadDefinitionsByInvalildClientId("");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
    });

  });

  describe('Filter by protocolTypeId and Client id', () => {
    it('207447 | (191648 - 2) /GET /payloaddefinitions filter by valid client id and protocolTypeId #smoke', async () => {
      let validProtocolProtocolTypeId = await request.getRandomProtocolProtocolTypeId();
      let protocol = await request_protocols.getProtocolsByProtocolId(validProtocolProtocolTypeId.protocolId);
      let clientId = protocol.body.mdmClientId;

      let response = await request.getPayloadsByClientAndProtId(clientId, validProtocolProtocolTypeId.protocolTypeId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllPayloadDefinitionsFields(response.body.results);
    });

    it('207447 | (191648 - 2) /GET /payloaddefinitions filter by valid protocolTypeId and client id #smoke', async () => {
      let validProtocolProtocolTypeId = await request.getRandomProtocolProtocolTypeId();
      let protocol = await request_protocols.getProtocolsByProtocolId(validProtocolProtocolTypeId.protocolId);
      let clientId = protocol.body.mdmClientId;

      let response = await request.getPayloadsByProtAndClientId(validProtocolProtocolTypeId.protocolTypeId, clientId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllPayloadDefinitionsFields(response.body.results);
    });

    it('191648 - 6 | /GET /payloaddefinitions filter by empty protocolTypeId and clientid', async () => {
      let response = await request.getPayloadsByInvalidClientAndProtId("", "");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
    });

    it('191648 - 5 | /GET /payloaddefinitions filter by protocolTypeId and clientid = null', async () => {
      let response = await request.getPayloadsByInvalidClientAndProtId(null, null);

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('191648 - 6 | /GET /payloaddefinitions filter by unexisting protocolTypeId and unexusting client', async () => {
      let response = await request.getPayloadsByClientAndProtId(invalidId, invalidId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

  });

  describe('Filter by clientId', () => {
    it('220740 | /GET /payloaddefinitions/{id} #smoke', async () => {
      let id = await request.getRandomPayloadDefinitionId();
      
      let response = await request.getPayloadDefinitionsById(id);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyAllPayloadDefinitionsFields([response.body]);
    });

    it('220741 - 1 | /GET /payloaddefinitions/{id}with id = null', async () => {
      let response = await request.getPayloadDefinitionsById(null);

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('220741 - 2 | /GET /payloaddefinitions/{id} with unexisted id', async () => {
      let response = await request.getPayloadDefinitionsById(invalidId);

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('220741 - 3 | /GET /payloaddefinitions/{id} with id is empty', async () => {
      let response = await request.getPayloadDefinitionsById(" ");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

  });

  describe('POST /payloaddefinition', () => {
    it('209796 & 210139 | POST /payloaddefinition #smoke', async () => {
      let payloadDefinitionBody = await generatePayloadDefinition();

      response = await request.postPayloadDefinitions(payloadDefinitionBody);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyPayloadDefinitionsPostAndPutResponse(response)
      payloadDefinitionId = response.body.id;

      let response_get = await request.getPayloadDefinitionsById(payloadDefinitionId);

      utilsEtl.verifyAllPayloadDefinitionsFields([response_get.body],
        payloadDefinitionId,
        payloadDefinitionBody.name,
        payloadDefinitionBody.engagementId,
        payloadDefinitionBody.projectId,
        payloadDefinitionBody.referenceListId,
        payloadDefinitionBody.protocolId,
        payloadDefinitionBody.notificationRecipients,
        payloadDefinitionBody.workflows,
        payloadDefinitionBody.fileTypes);
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no name provided', async () => {
      let correctData = data.regression.correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'name')

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "'Name' must not be empty.")
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no engagementId provided', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'engagementId')

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no projectId provided', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'projectId')

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'projectId', "'Project Id' must not be empty.")
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no referenceListId provided', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'referenceListId')

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'referenceListId', "'Reference List Id' must not be empty.")
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no protocolId provided ', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'protocolId')
      
      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no notificationRecipients provided', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'notificationRecipients')

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'notificationRecipients', "'Notification Recipients' must not be empty.")
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no procedures provided', async () => {
      let correctData = correctParameters;
      let modifiedData = utils.clearDataField(correctData, 'procedures')
      
      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no procedures.filePatterns provided', async () => {
      let modifiedData = correctParameters;
      modifiedData.procedures[0].filePatterns[0] = [];

      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no procedures.filePatterns.name provided', async () => {
      let modifiedData = correctParameters;
      modifiedData.procedures[0].filePatterns[0].pattern = "";
      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('210140 - 1 | POST /payloaddefinition error messages checking - no procedures.filePatterns.fileId provided', async () => {
      let modifiedData = correctParameters;
      modifiedData.procedures[0].filePatterns[0].fileId = "";
      let response = await request.postPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('210140 - 3 | POST /payloaddefinition - fields = null', async () => {
      let incorrectData = fieldsNull;


      let response = await request.postPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('210140 - 4 | POST /payloaddefinition - long values', async () => {
      let incorrectData = longValues;


      let response = await request.postPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('210140 - 2 | POST /payloaddefinition - invalid ', async () => {
      let incorrectData = invalid;
      incorrectData.mdmClientId = mdmClientId

      let response = await request.postPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
    });

  });

  describe('PUT /payloaddefinition', () => {
    let correctUpdateBody;

    before( async() => {
        correctUpdateBody = await generatePayloadDefinition();
        if (null == payloadDefinitionId) {
          let response = await request.postPayloadDefinitions(correctUpdateBody);
          correctUpdateBody.id = response.body.id;
        } else {
          correctUpdateBody.id = payloadDefinitionId;
        }
    });

    it('225442 | PUT /payloaddefinition #smoke', async () => { 
      
      response = await request.putPayloadDefinitions(correctUpdateBody);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyPayloadDefinitionsPostAndPutResponse(response)

      let response_get = await request.getPayloadDefinitionsById(correctUpdateBody.id);

      utilsEtl.verifyAllPayloadDefinitionsFields([response_get.body],
        correctUpdateBody.id,
        correctUpdateBody.name,
        correctUpdateBody.engagementId,
        correctUpdateBody.projectId,
        correctUpdateBody.referenceListId,
        correctUpdateBody.protocolId,
        correctUpdateBody.notificationRecipients,
        correctUpdateBody.workflows,
        correctUpdateBody.fileTypes);
    });

    it('225443 | PUT /payloaddefinition error messages checking - no name provided', async () => {
      let correctData = data.regression.correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'name')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "'Name' must not be empty.")
    });

    it('225443 | PUT /payloaddefinition error messages checking - no engagementId provided ', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'engagementId')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('225443 | PUT /payloaddefinition error messages checking - no projectId provided ', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'projectId')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'projectId', "'Project Id' must not be empty.")
    });

    it('225443 | PUT /payloaddefinition error messages checking - no referenceListId provided ', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'referenceListId')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'referenceListId', "'Reference List Id' must not be empty.")
    });

    it('225443 | PUT /payloaddefinition error messages checking - no protocolId provided', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'protocolId')

      let response = await request.putPayloadDefinitions(modifiedData)
     
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('225443 | PUT /payloaddefinition error messages checking - no notificationRecipients provided', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'notificationRecipients')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'notificationRecipients', "'Notification Recipients' must not be empty.")
    });

    it('225443 | PUT /payloaddefinition error messages checking - no procedures provided ', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = utils.clearDataField(correctData, 'procedures')

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('225443 | PUT /payloaddefinition error messages checking - no fileTypes provided', async () => {
      let correctData = correctParameters;
      correctData.id = payloadDefinitionId;
      let modifiedData = correctData;
      modifiedData.procedures[0].filePatterns[0] = [];

      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('225443 | PUT /payloaddefinition error messages checking - no fileTypes.name provided', async () => {
      let modifiedData = correctParameters;
      modifiedData.id = payloadDefinitionId;

      //modifiedData.fileTypes[0].pattern = "";
      modifiedData.procedures[0].filePatterns[0].pattern = "";
      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('225443 | PUT /payloaddefinition error messages checking - no procedures.filePatterns.fileId provided', async () => {
      let modifiedData = correctParameters;
      modifiedData.id = payloadDefinitionId;

      modifiedData.procedures[0].filePatterns[0].fileId = "";
      let response = await request.putPayloadDefinitions(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('225443 | PUT /payloaddefinition - fields = null', async () => {
      let incorrectData = fieldsNull;
      incorrectData.id = payloadDefinitionId;

      let response = await request.putPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('225443 | PUT /payloaddefinition - long values', async () => {
      let incorrectData = longValues;
      incorrectData.id = payloadDefinitionId;

      let response = await request.putPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('225443 | PUT /payloaddefinition - invalid', async () => {
      let incorrectData = invalid;

      let response = await request.putPayloadDefinitions(incorrectData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

  });
  
  
  /*
  Payload body has body
  {
      "name": "<name>",
      "engagementId": "<id>", 
      "projectId": "<id>", 
      "referenceListId": "<id>", 
      "protocolId": "<id>",
      "notificationRecipients": "<name of rec.>",
      "procedures": [{
        "id": "<id>",
        "filePatterns": [
          {
            "fileId": "<id>",
            "pattern": "<pattern>"
          }
        ]
      }]
    }
  */
  async function generatePayloadDefinition() {
    //get correct parameters and body
    let body = correctParameters;
    body.name = "my payload " + timestamp;
    //get dynamic values 
    //get random procedure
    let listOfClients = await request_client.getClients();
    
    let obj = await request_procedures.getProcedureWithFileTypesAndClientId(listOfClients);

    //setup body with new parameters
    body.procedures[0].id = obj.procedure.id;
    let n = 0;
    for (const _pr of obj.procedure.files) {
      body.procedures[0].filePatterns[n] = { fileId: _pr.id, pattern: "file_" + n + ".xlsx" };
      correctParameters.procedures[0].filePatterns[n] = { fileId: _pr.id, pattern: "file_" + n + ".xlsx" };
      n++;
    }
    
    //get random protocol id by client id
    let protocolId = await request_protocols.getRandomProtocolIdByClientId(obj.mdmclientId);
    if (null == protocolId){
  
      let protocolbody = data_protocol.regression.correctParameters;
      let protocolTypeId = await request_protocol_type.getRandomProtocolTypeId();
      protocolbody.mdmClientId = obj.mdmclientId;
      protocolbody.protocolTypeId = protocolTypeId;
      
      let response_ = await request_protocols.postProtocols(protocolbody);
      protocolId = response_.body.id
    }
    
    body.protocolId = protocolId;
    correctParameters.protocolId = protocolId;
    correctParameters.procedures[0].id = obj.procedure.id;
    body.mdmClientId = mdmClientId

    return body;
  }

});