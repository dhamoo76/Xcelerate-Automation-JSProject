const expect = require('chai').expect
const EngagementsAPI = require('../../../src/api/cem.engagementsAPI')
const ClientsAPI = require('../../../src/api/cem.clientsAPI')
const Str = require('@supercharge/strings')
const UIConfigurationsAPI = require('../../../src/api/cem.UIconfigurationsAPI')
const statusCode = require('../../../constants/status-code')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCEM = require('../api/utilities/utilities-CEM')
let utils = new Utilities()
let utilsCem = new UtilitiesCEM()

const date = new Date()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowPlus = new Date()
tomorrowPlus.setDate(tomorrow.getDate() + 5);
const today = date.toISOString()
const todayPlusOne = tomorrow.toISOString()
const tooLongString = Str.random(201).toString()
const maxLengthName = Str.random(200).toString()
const tooLongDescription = Str.random(251).toString()
const maxLengthDescription = Str.random(250).toString()
const wrongGuidEngagementID = "8bc1fc6a-3fae-4126-b8fb-4eec108b3112"

describe('CEM - Engagements endpoint /GET smoke', () => {
  let request = new EngagementsAPI();
  let body = {
    "name": "",
    "description": "",
    "lineOfBusiness": "",
    "type": "string",
    "scheduledStartDate": "",
    "scheduledEndDate": "",
    "sow": "string",
    "sowDate": "",
    "mdmClientId": 0
  }

  let newBody
  let requestClients = new ClientsAPI();
  let randomClientId

  it('190252 ,202715, 205152, 205154 | Get all engagements #smoke', async () => {
    let response = await request.getEngagements();
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    utils.checkIfResponseResultsAreNotEmpty(response)
  });

  it(' Get all engagements without token #smoke', async () => {
    let response = await request.getEngagementsWithoutToken();
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });

  it('190252 - 2 , 202711| Get engagement by ID #smoke', async () => {
    const randomEngagementID = await request.getRandomEngagementId();
    let response = await request.getEngagementById(randomEngagementID)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    expect(response.body, "Results are not empty " + response.body).not.to.be.empty;
    expect(response.body.id, "Engagement ID is not correct" + response.body.id).to.be.equal(randomEngagementID)

  });

  it('| Get engagement by ID Without token #smoke', async () => {
    const randomEngagementID = await request.getRandomEngagementId();
    let response = await request.getEngagementByIdWithoutToken(randomEngagementID)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });

  it('190252 | Get just created engagement by ID #smoke', async () => {
    randomClientId = await requestClients.getRandomClientId();

    body.name = maxLengthName
    body.description = maxLengthDescription
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = maxLengthName
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    const engagementId = response.body.id

    const responseGet = await request.getEngagementById(engagementId)
    utils.checkIfStatusCodeIsEqual(responseGet, statusCode.OK)
    utilsCem.verifyAllfieldsEngagements(responseGet, body);

  });

});


describe('CEM - Engagements endpoint /POST smoke', () => {
  let request = new EngagementsAPI();
  let requestUIconfiguration = new UIConfigurationsAPI();
  let body = {
    "name": "",
    "description": "",
    "lineOfBusiness": "",
    "type": "string",
    "scheduledStartDate": "",
    "scheduledEndDate": "",
    "sow": "string",
    "sowDate": "",
    "mdmClientId": 0
  }

  let newBody
  let requestClients = new ClientsAPI();
  let randomClientId
  let timestamp
  let engagementTypesWithGroups

  it('188608-2, 205379 |Add new engagement #smoke', async () => {
    randomClientId = await requestClients.getRandomClientId();
    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = maxLengthDescription
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = maxLengthName
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsEngagements(response, body);
  });

  it('|Add new engagement without token #smoke', async () => {
    randomClientId = await requestClients.getRandomClientId();
    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = maxLengthDescription
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = maxLengthName
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagementsWithoutToken(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsEngagements(response, body);
  });

  it('188608-2, 205380 |Add new engagement with all LOB and Types ', async () => {


    engagementTypesWithGroups = await requestUIconfiguration.getUiConfigurationsForEngagementsOnly()

    for (const engagementType of engagementTypesWithGroups) {
      randomClientId = await requestClients.getRandomClientId();
      timestamp = Date.now()

      body.name = "name_" + timestamp
      body.description = ""
      body.lineOfBusiness = engagementType.group
      body.type = engagementType.name
      body.scheduledStartDate = today
      body.scheduledEndDate = todayPlusOne
      body.mdmClientId = randomClientId
      body.sow = ""
      body.sowDate = today

      newBody = JSON.stringify(body)

      const response = await request.postEngagements(newBody)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

      utilsCem.verifyAllfieldsEngagements(response, body);

    }

    // Verifications for all valid combinations for LOB and Type
  }).timeout(100000);

  it('188608-3 |Validation For Name Field > max length ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    body.name = tooLongString
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-3 |Validation For Empty Name Field ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    body.name = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-4 , 205378 , 205379|Validation For Description field > Max length ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    body.name = maxLengthName
    body.description = tooLongDescription
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-4 |Validation For empty Description field ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsEngagements(response, body);
  });

  it('188608-7 |Validation For SOW Reference field > max length ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = tooLongString
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-7 |Validation For empty SOW Reference field ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = today
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsEngagements(response, body);

  });

  it('188608-8 |Validation if Scheduled End Date that is earlier that the Schedule Start Date ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = today
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-8 |Validation if Scheduled End Date that = the Schedule Start Date', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Audit"
    body.type = "Audit"
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = todayPlusOne
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-5 |Validation for empty LOB field ', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = ''
    body.type = "Audit"
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-5 |Validation for wrong LOB field', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = 'Audit30'
    body.type = "Audit"
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-6 |Validation for wrong Engagement type field', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Tax"
    body.type = "Audit"
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-6 |Validation for empty Engagement type field', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Tax"
    body.type = ''
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('188608-10|Validation for duplicate Engagement Name #smoke', async () => {
    randomClientId = await requestClients.getRandomClientId();

    timestamp = Date.now()

    body.name = "Name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Tax"
    body.type = 'Tax Return'
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today

    newBody = JSON.stringify(body)

    const response = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)


    const responseWithDuplicateName = await request.postEngagements(newBody)
    utils.checkIfStatusCodeIsEqual(responseWithDuplicateName, statusCode.UNPROCESSABLE_ENTITY)
  });

});

describe('CEM - Engagements endpoint /PUT smoke', () => {
  let request = new EngagementsAPI();
  let body = {
    "name": "",
    "description": "",
    "lineOfBusiness": "",
    "type": "string",
    "scheduledStartDate": "",
    "scheduledEndDate": "",
    "sow": "string",
    "sowDate": "",
    "mdmClientId": 0
  }

  let bodyForUpdate = {
    "id": "",
    "name": "",
    "description": "",
    "lineOfBusiness": "Tax",
    "type": "Tax1",
    "status": "Active",
    "scheduledStartDate": "2021-08-27T16:05:58.517+00:00",
    "scheduledEndDate": "2021-08-28T16:05:58.517+00:00",
    "creatorId": "E083656",
    "sow": "",
    "sowDate": "2021-08-27T16:05:58.517+00:00",
    "mdmClientId": 0
  }

  let newBody
  let requestClients = new ClientsAPI();
  let randomClientId
  let timestamp
  let randomEngagementName
  let randomEngagementID

  it('190245-9,15|Update engagement - verification for valid update #smoke', async () => {
    const randomEngagementID = await request.getRandomEngagementId();
    let response = await request.getEngagementById(randomEngagementID)
    const engagementStatus = response.body.status
    let engagementStatusForUpdate
    let engagementLOBForUpdate
    let engagementType
    if (engagementStatus == "Active") {
      engagementStatusForUpdate = "Inactive"
    } else {
      engagementStatusForUpdate = "Active"
    }

    const enagementLineOfBusiness = response.body.lineOfBusiness
    if (enagementLineOfBusiness == "Tax") {
      engagementLOBForUpdate = "Audit"
      engagementType = "Audit"
    } else {
      engagementLOBForUpdate = "Tax"
      engagementType = "Tax Return"
    }


    timestamp = Date.now()

    bodyForUpdate.id = response.body.id
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = ''
    bodyForUpdate.lineOfBusiness = engagementLOBForUpdate
    bodyForUpdate.type = engagementType
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = tomorrowPlus
    bodyForUpdate.mdmClientId = response.body.mdmClientId
    bodyForUpdate.sow = ''
    bodyForUpdate.sowDate = today
    bodyForUpdate.status = engagementStatusForUpdate

    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateEngagement(randomEngagementID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.OK)
    expect(responseForUpdate.body.id, "Engagement ID is correct " + responseForUpdate.id).to.be.equal(randomEngagementID)
    utilsCem.verifyAllfieldsEngagementsForUpdate(responseForUpdate, bodyForUpdate, engagementStatusForUpdate);



  });

  it('190245-5|Update engagement - validation for duplicate Engagement Name #smoke', async () => {
    randomClientId = await requestClients.getRandomClientId();
    randomEngagementName = await request.getRandomEngagementName();
    randomEngagementID = await request.getRandomEngagementId();

    timestamp = Date.now()

    body.name = "name_" + timestamp
    body.description = ''
    body.lineOfBusiness = "Tax"
    body.type = 'Tax Return'
    body.scheduledStartDate = todayPlusOne
    body.scheduledEndDate = tomorrowPlus
    body.mdmClientId = randomClientId
    body.sow = ''
    body.sowDate = today
    body.status = "Active"

    newBody = JSON.stringify(body)

    // POst New Engagement and remember its ID
    const response = await request.postEngagements(newBody)
    const engagementID = response.body.id


    //Prepare the second Engagement and remember its Name
    body.name = "New_Name" + timestamp
    newBody = JSON.stringify(body)
    const newResponse = await request.postEngagements(newBody)
    const newName = newResponse.body.name

    //Prepare body for Update the first Engagement with the Second Engagement's name
    bodyForUpdate.id = engagementID
    bodyForUpdate.mdmClientId = randomClientId
    bodyForUpdate.name = newName

    newBodyForUpdate = JSON.stringify(bodyForUpdate)

    //Update Engagement
    const responseForUpdate = await request.updateEngagement(engagementID, newBodyForUpdate)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('190245-8|Update engagement - update for not updatable fields', async () => {
    const randomEngagementID = await request.getRandomEngagementId();
    const response = await request.getEngagementById(randomEngagementID)
    const mdmClientID = response.body.mdmClientId
    const creatorID = response.body.creatorId

    timestamp = Date.now()

    bodyForUpdate.id = response.body.id
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = ''
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = tomorrowPlus
    bodyForUpdate.mdmClientId = response.body.mdmClientId + timestamp
    bodyForUpdate.sow = ''
    bodyForUpdate.sowDate = today
    bodyForUpdate.status = "Active"
    bodyForUpdate.creatorId = "Creator_" + timestamp

    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateEngagement(randomEngagementID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.OK)
    expect(responseForUpdate.body.id, "Engagement ID is  not correct " + responseForUpdate.id).to.be.equal(randomEngagementID)
    expect(responseForUpdate.body.mdmClientId, "MdmdCLientID is not correct " + responseForUpdate.mdmClientId).to.be.equal(mdmClientID)
    expect(responseForUpdate.body.creatorId, "CreatorID is not correct " + responseForUpdate.creatorId).to.be.equal(creatorID)
  });

  it('190245-8|Update engagement - validation for wrong ID field', async () => {
    const randomEngagementID = await request.getRandomEngagementId()
    const response = await request.getEngagementById(randomEngagementID)


    timestamp = Date.now()

    bodyForUpdate.id = wrongGuidEngagementID
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = ''
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = tomorrowPlus
    bodyForUpdate.mdmClientId = response.body.mdmClientId
    bodyForUpdate.sow = ''
    bodyForUpdate.sowDate = today
    bodyForUpdate.status = "Active"
    bodyForUpdate.creatorId = "Creator_" + timestamp

    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateEngagement(randomEngagementID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.BAD_REQUEST)
  });


  it('190245-8|Engagement update field values', async () => {
    const randomEngagementID = await request.getRandomEngagementId()
    const response = await request.getEngagementById(randomEngagementID)


    timestamp = Date.now()

    bodyForUpdate.id = wrongGuidEngagementID
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = ''
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = tomorrowPlus
    bodyForUpdate.mdmClientId = response.body.mdmClientId
    bodyForUpdate.sow = ''
    bodyForUpdate.sowDate = today
    bodyForUpdate.status = "Active"
    bodyForUpdate.creatorId = "Creator_" + timestamp

    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateEngagement(randomEngagementID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.BAD_REQUEST)
  });

  it('|Engagement update field values without token', async () => {
    const randomEngagementID = await request.getRandomEngagementId()
    const response = await request.getEngagementById(randomEngagementID)


    timestamp = Date.now()

    bodyForUpdate.id = wrongGuidEngagementID
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = ''
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = tomorrowPlus
    bodyForUpdate.mdmClientId = response.body.mdmClientId
    bodyForUpdate.sow = ''
    bodyForUpdate.sowDate = today
    bodyForUpdate.status = "Active"
    bodyForUpdate.creatorId = "Creator_" + timestamp

    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateEngagementWithoutToken(randomEngagementID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.UNAUTHORIZED)
  });


});