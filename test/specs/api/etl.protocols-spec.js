const chai = require('chai')
const expect = chai.expect
const { proxy, flush } = require('@alfonso-presa/soft-assert')
const softExpect = proxy(expect)
chai.config.proxyExcludedKeys.push('catch')

const data = require('../../../data/protocols')
const invalidData = require('../../../data/config').invalidData
const statusCode = require('../../../constants/status-code')

const ProtocolsAPI = require('../../../src/api/etl.protocolsAPI');
const ClientsAPI = require('../../../src/api/cem.clientsAPI')
const ProtocolTypesAPI = require('../../../src/api/etl.protocolTypesAPI')
const timestamp = Date.now();
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/protocols verification', () => {
  let request = new ProtocolsAPI();
  let request_clients = new ClientsAPI();
  let request_protocolTypes = new ProtocolTypesAPI();
  let newProtocolId

  describe('Filter by clientId (mdmClientId)', () => {
    it('218478 | GET /protocols (without filtering) #smoke', async () => {
      let response = await request.getProtocols();

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllProtocolsFields(response.body.results);
    });

    it('207439 | GET /protocols with filter by valid client id (mdmClientId) #smoke', async () => {
      let validClientId = await request.getRandomClientId();

      let response = await request.getProtocolsByClientId(validClientId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllProtocolsFields(response.body.results, validClientId);
    });

    it('191640 - 6 | GET /protocols with filter by empty client id', async () => {
      let response = await request.getProtocolsByInvalidClientId("");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
    });


    it('191640 - 7 | GET /protocols with Filter by client id = null', async () => {
      let response = await request.getProtocolsByInvalidClientId(null);

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('191640 - 8 | GET /protocols with filter by unexisting client id', async () => {
      let response = await request.getProtocolsByClientId(invalidData.invalidId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

  });

  describe('Filter by protocolTypeName', () => {
    it('207333 | Filter by valid protocolTypeName #smoke', async () => {
      let validProtocolId = await request.getRandomProtocolTypeId();
      let validProtocolTypeName = await request_protocolTypes.getProtocolNameById(validProtocolId);

      let response = await request.getProtocolsByProtocolTypeName(validProtocolTypeName);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllProtocolsFields(response.body.results, null, validProtocolTypeName, null);
    }).timeout(20000);

    it('191640 - 6 | GET /protocols with filter by empty protocolTypeName -- BUG 236642', async () => {
      let response = await request.getProtocolsByProtocolTypeName("");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
    }).timeout(20000);

    it('191640 - 7 | GET /protocols with Filter by protocolTypeName = null -- BUG 236642', async () => {
      let response = await request.getProtocolsByInvalidProtocolTypeId(null);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    });

    it('191640 - 8 | GET /protocols with filter by unexisting protocolTypeName', async () => {
      let response = await request.getProtocolsByProtocolTypeName(invalidData.invalidProtocolTypeName);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreEmpty(response)
    });

  });

  describe('Filter by protocolTypeId', () => {
    it('207440 | Filter by valid protocolTypeId #smoke', async () => {
      let validProtocolTypeId = await request.getRandomProtocolTypeId();
      let response = await request.getProtocolsByProtocolTypeId(validProtocolTypeId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllProtocolsFields(response.body.results, null, null, validProtocolTypeId);
    });

    it('191640 - 6 | Filter by empty protocolTypeId', async () => {
      let response = await request.getProtocolsByInvalidProtocolTypeId("");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
    });

    it('191640 - 7 | GET /protocols with filter by protocolTypeId = null', async () => {
      let response = await request.getProtocolsByProtocolTypeId(null);

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('191640 - 8 | GET /protocols with filter by unexisting protocolTypeId', async () => {
      let response = await request.getProtocolsByProtocolTypeId(invalidData.invalidId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreEmpty(response)
    });

  });


  describe('/protocols/{id}', () => {
    it('219686 | /protocols/{id} correct id #smoke', async () => {
      let randomProtocolId = await request.getRandomProtocolId();

      let response = await request.getProtocolsByProtocolId(randomProtocolId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyAllProtocolsFields([response.body], null, null, null, randomProtocolId);
    });

    it('219687-1 | /protocols/{id} id=null', async () => {
      let response = await request.getProtocolsByProtocolId(null);

      utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
    });

    it('219687-2 | /protocols/{id} id is empty', async () => {
      let response = await request.getProtocolsByProtocolId(" ");

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
    });

    it('219687-3 | /protocols/{id} incorrect id #smoke', async () => {
      let response = await request.getProtocolsByProtocolId(invalidData.invalidId);

      utils.checkIfStatusCodeIsEqual(response, statusCode.NOT_FOUND)
    });

  });

  describe('Add protocol', () => {
    let correctData;

    before(async () => {
      correctData = await generateProtocol();
    });

    it('212858 | POST /protocols correct parameters #smoke', async () => {
      let response = await request.postProtocols(correctData)

      newProtocolId = response.body.id
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyProtocolsPostAndPutResponse(response)
    })

    it('212858 | POST /protocols correct parameters - verify if created protocol was saved successfully #smoke #FFF', async () => {
      let response = await request.getProtocolsByProtocolId(newProtocolId)
      console.log('response:' + JSON.stringify(response.body))
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      softExpect(response.body.id, "Response not contains correct ID, current value: " + response.body.id, "Expected: " + newProtocolId).to.eql(newProtocolId)
      softExpect(response.body.name, "Response not contains correct name, current value: " + response.body.name, "Expected: " + correctData.name).to.eql(correctData.name)
      softExpect(response.body.mdmClientId, "Response not contains correct mdmClientId, current value: " + response.body.mdmClientId, "Expected: " + correctData.mdmClientId).to.eql(correctData.mdmClientId)
      softExpect(response.body.protocolTypeId, "Response not contains correct protocolTypeId, current value: " + response.body.protocolTypeId, "Expected: " + correctData.protocolTypeId).to.eql(correctData.protocolTypeId)
      softExpect(response.body.url, "Response not contains correct url, current value: " + response.body.url, "Expected: " + correctData.url).to.eql(correctData.url)
      softExpect(response.body.folderPath, "Response not contains correct folderPath, current value: " + response.body.folderPath, "Expected: " + correctData.folderPath).to.eql(correctData.folderPath)
      console.log("USERNAME" + correctData.userName)
      console.log("USERNAME" + response.body.userName)
      softExpect(response.body.userName, "Response not contains correct userName, current value: " + response.body.userName, "Expected: " + correctData.userName).to.be.equal(correctData.userName)

      softExpect(response.body.password, "Response not contains correct password, current value: " + response.body.password, "Expected: " + correctData.password).to.eql(correctData.password)
      flush()
    })

    it('212859 | POST /protocols mandatory fields #smoke', async () => {
      //note: in sprint8 - update this TC - make dynamic
      let body = await generateMandatoryFieldsBody();
      let response = await request.postProtocols(body);

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyProtocolsPostAndPutResponse(response)
    });

    it('212860 - 1 | POST /protocols error messages checking - no name provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'name')

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "'Name' must not be empty.")
    });

    it('212860 - 2 | POST /protocols error messages checking - no mdmClientId provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'mdmClientId')

      let response = await request.postProtocols(modifiedData)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('212860 - 3 | POST /protocols error messages checking - no protocolTypeId provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'protocolTypeId')

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'protocolTypeId', "'Protocol Type Id' must not be empty.")
    });

    it('212860 - 4 | POST /protocols error messages checking - no url provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'url')

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'url', "'Url' must not be empty.")
    });

    it('212860 - 5 | POST /protocols error messages checking - no userName provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'userName')

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userName', "'User Name' must not be empty.")
    });

    it('212860 - 6 | POST /protocols error messages checking - no password provided', async () => {
      let modifiedData = utils.clearDataField(correctData, 'password')

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'password', "'Password' must not be empty.")
    });

    it('212860 - 7 | POST /protocols error messages checking - too long name', async () => {
      let modifiedData = utils.changeDataField(correctData, 'name', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "The length of 'Name' must be 255 characters or fewer.")
    });

    it('212860 - 8 | POST /protocols error messages checking - too long url', async () => {
      let modifiedData = utils.changeDataField(correctData, 'url', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'url', "The length of 'Url' must be 255 characters or fewer.")
    });

    it('212860 - 9 | POST /protocols error messages checking - too long folderPath', async () => {
      let modifiedData = utils.changeDataField(correctData, 'folderPath', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'folderPath', "The length of 'Folder Path' must be 255 characters or fewer.")
    });

    it('212860 - 10 | POST /protocols error messages checking - too long userName', async () => {
      let modifiedData = utils.changeDataField(correctData, 'userName', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userName', "The length of 'User Name' must be 255 characters or fewer.")
    });

    it('212860 - 11 | POST /protocols error messages checking - too long password', async () => {
      let modifiedData = utils.changeDataField(correctData, 'password', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'password', "The length of 'Password' must be 255 characters or fewer.")
    });

    it('212861 | POST /protocols incorrect IDs - incorrect protocolTypeId', async () => {
      let modifiedData = utils.changeDataField(correctData, 'protocolTypeId', invalidData.incorrectProtocolTypeId)

      let response = await request.postProtocols(modifiedData)

      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'protocolTypeId', "Protocol type with ID " + invalidData.incorrectProtocolTypeId + " does not exist.")
    });

    it('233341 | POST /protocols error messages checking - empty folder', async () => {
      let modifiedData = utils.changeDataField(correctData, 'folderPath', invalidData.longValue)

      let response = await request.postProtocols(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('233340 | POST /protocols error messages checking - without folder', async () => {
      let modifiedData = utils.clearDataField(correctData, 'folderPath')

      let response = await request.postProtocols(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });
  });

  describe('Update protocol', () => {
    let updatedProtocol = data.regression.correctParameters
    let mandatoryData 

    let correctUpdateBody;

    before(async () => {
      mandatoryData = await generateMandatoryFieldsBody();
      correctUpdateBody = await generateProtocol();
      if (null == newProtocolId) {
        let response = await request.postProtocols(correctUpdateBody);
        correctUpdateBody.id = response.body.id;

      } else {
        correctUpdateBody.id = newProtocolId;
      }
      mandatoryData.id = newProtocolId;
    });

    it('212866 | PUT /protocols correct parameters #smoke - BUG 236601', async () => {
      let response = await request.updateProtocol(correctUpdateBody)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyProtocolsPostAndPutResponse(response, newProtocolId)
    });

    it('212866 | PUT /protocols correct parameters - verify if new protocol was updated successfully #smoke', async () => {
      let response = await request.getProtocolsByProtocolId(newProtocolId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      softExpect(response.body.id, "Response not contains correct ID, current value: " + response.body.id, "Expected: " + newProtocolId).to.eql(newProtocolId)
      softExpect(response.body.name, "Response not contains correct name, current value: " + response.body.name, "Expected: " + updatedProtocol.name).to.eql(updatedProtocol.name)
      softExpect(response.body.mdmClientId, "Response not contains correct mdmClientId, current value: " + response.body.mdmClientId, "Expected: " + updatedProtocol.mdmClientId).to.eql(updatedProtocol.mdmClientId)
      softExpect(response.body.protocolTypeId, "Response not contains correct protocolTypeId, current value: " + response.body.protocolTypeId, "Expected: " + updatedProtocol.protocolTypeId).to.eql(updatedProtocol.protocolTypeId)
      softExpect(response.body.url, "Response not contains correct url, current value: " + response.body.url, "Expected: " + updatedProtocol.url).to.eql(updatedProtocol.url)
      softExpect(response.body.folderPath, "Response not contains correct folderPath, current value: " + response.body.folderPath, "Expected: " + updatedProtocol.folderPath).to.eql(updatedProtocol.folderPath)
      softExpect(response.body.userName, "Response not contains correct userName, current value: " + response.body.userName, "Expected: " + updatedProtocol.userName).to.eql(updatedProtocol.userName)
      softExpect(response.body.password, "Response not contains correct password, current value: " + response.body.password, "Expected: " + updatedProtocol.password).to.eql(updatedProtocol.password)
      flush()
    });

    it('212867 | PUT /protocols mandatory fields - BUG 236601 #FIX', async () => {
      
      let response = await request.updateProtocol(mandatoryData)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyProtocolsPostAndPutResponse(response, newProtocolId)
    });

    it('212860 - 1 | PUT /protocols error messages checking - no name provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'name')

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "'Name' must not be empty.")
    });

    it('212860 - 2 | PUT /protocols error messages checking - no mdmClientId provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'mdmClientId')

      let response = await request.updateProtocol(modifiedData)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('212860 - 3 | PUT /protocols error messages checking - no protocolTypeId provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'protocolTypeId')

      let response = await request.updateProtocol(modifiedData)

      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'protocolTypeId', "'Protocol Type Id' must not be empty.")

    });

    //less priority test, field is not required
    it('212860 - 4 | PUT /protocols error messages checking - no url provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'url')

      let response = await request.updateProtocol(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
      //utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'url', "'Url' must not be empty.")
    });

    //less priority test, field is not required
    it('212860 - 5 | PUT /protocols error messages checking - no userName provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'userName')

      let response = await request.updateProtocol(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
      //utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userName', "'User Name' must not be empty.")
    });

    //less priority test, field is not required
    it('212860 - 6 | POST /protocols error messages checking - no password provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'password')

      let response = await request.updateProtocol(modifiedData)
      utils.checkIfStatusCodeIsNotEqual(response, statusCode.INTERNAL_SERVER_ERROR)
      //utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'password', "'Password' must not be empty.")
    });

    it('212868 - 7 | PUT /protocols error messages checking - no id provided', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.clearDataField(correctData, 'id')

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'id', "'Id' must not be empty.")
    });

    it('212868 - 8 | PUT /protocols error messages checking - too long name', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'name', invalidData.longValue)

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'name', "The length of 'Name' must be 255 characters or fewer.")
    });

    it('212868 - 9 | PUT /protocols error messages checking - too long url', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'url', invalidData.longValue)

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'url', "The length of 'Url' must be 255 characters or fewer.")
    });

    it('212868 - 10 | PUT /protocols error messages checking - too long folderPath', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'folderPath', invalidData.longValue)

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'folderPath', "The length of 'Folder Path' must be 255 characters or fewer.")
    });

    it('212868 - 11 | PUT /protocols error messages checking - too long userName', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'userName', invalidData.longValue)

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userName', "The length of 'User Name' must be 255 characters or fewer.")
    });

    it('212868 - 12 | PUT /protocols error messages checking - too long password', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'password', invalidData.longValue)

      let response = await request.updateProtocol(modifiedData)
      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'password', "The length of 'Password' must be 255 characters or fewer.")
    });

    it('212869 - 1 | PUT /protocols incorrect IDs - incorrect protocol type Id', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'protocolTypeId', invalidData.incorrectProtocolTypeId)

      let response = await request.updateProtocol(modifiedData)

      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'protocolTypeId', "Protocol type with ID " + invalidData.incorrectProtocolTypeId + " does not exist.")
    });

    it('212869 - 2 | PUT /protocols incorrect IDs - incorrect protocol Id', async () => {
      let correctData = data.regression.correctParameters
      let modifiedData = utils.changeDataField(correctData, 'id', invalidData.notExistingProtocolId)

      let response = await request.updateProtocol(modifiedData)

      utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'id', "Updated entity does not exists in database.")
    });

    it('233342 | PUT /protocols error messages checking - empty folderPath', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'folderPath', "")

      let response = await request.updateProtocol(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    it('233340 | PUT /protocols error messages checking - no folderPath', async () => {
      let correctData = updatedProtocol
      let modifiedData = utils.changeDataField(correctData, 'folderPath', "")

      let response = await request.updateProtocol(modifiedData)
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

  });

  /* the body of protocol
  correctParameters: {
     "name": "name_" + timestamp,
     "mdmClientId": '',
     "protocolTypeId": '',
     "url": "www.url.com",
     "folderPath": "folderPath" + timestamp,
     "userName": "user_" + timestamp,
     "password": "password_" + timestamp
   },
  */
  async function generateMandatoryFieldsBody() {
    let body = {};

    let protocolType = await request_protocolTypes.getRandomProtocolType();
    body.protocolTypeId = protocolType.id;
    let properties = await protocolType.properties;
    let i = 0;
    while (null != properties[i]) {
      if (properties[i].required) {
        body[`${properties[i].name}`] = properties[i].name + 'm' + timestamp;
      }
      i++
    }
    body.mdmClientId = await request_clients.getRandomClientId();
    body.name = "my protocol " + timestamp;
    console.log("body:" + JSON.stringify(body))

    return body;
  }

  async function generateProtocol() {
    let body = data.regression.correctParameters;

    body.protocolTypeId = await request_protocolTypes.getRandomProtocolTypeId();
    body.mdmClientId = await request_clients.getRandomClientId();
    return body;
  }
});