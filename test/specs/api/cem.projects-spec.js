const expect = require('chai').expect
const EngagementsAPI = require('../../../src/api/cem.engagementsAPI')
const ProjectsAPI = require('../../../src/api/cem.projectsAPI')
const ClientsAPI = require('../../../src/api/cem.clientsAPI')
const UIConfigurationsAPI = require('../../../src/api/cem.UIconfigurationsAPI')
const LegalEntitiesAPI = require('../../../src/api/cem.legalEntitiesAPI')
const Str = require('@supercharge/strings')
const statusCode = require('../../../constants/status-code')
const config = require('../../../data/config')
const API = require('../../../src/api/API')
const request_API = new API()
const projects = config.requests.CEM.projects

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
const tooLongString = Str.random(51).toString()
const maxLengthName = Str.random(50).toString()
const maxLengthNameForUpdate = Str.random(50).toString()

const tooLongDescription = Str.random(151).toString()
const maxLengthDescription = Str.random(150).toString()
const wrongGuidProjectID = "8bc1fc6a-3fae-4126-b8fb-4eec108b3112"
const validYearMin = 2010
const validYearMax = 9999
const invalidYearMin = 2009
const invslidYearMax = 10000
const activeStatus = "Active"

let legalEntityId_1 = 0
let legalEntityId_2 = 0
let legalEntityId_3 = 0

describe('CEM - Projects endpoint smoke /Get', () => {
  let request = new ProjectsAPI(); 

  it('205127 | Get all projects #smoke', async () => {
    let response = await request.getProjects();
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utils.checkIfResponseResultsAreNotEmpty(response)
  });

  it(' Get all projects without token #smoke', async () => {
    let response = await request.getProjectsWithoutToken();
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)

  });

  it('205127 - 2 | Get project by ID #smoke', async () => {
    const randomProjectId = await request.getRandomProjectId();
    let response = await request.getProjectById(randomProjectId)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    expect(response.body, "Results are not empty " + response.body).not.to.be.empty;
    expect(response.body.id, "Project ID is not correct" + response.body.id).to.be.equal(randomProjectId)
    utilsCem.verifyAllfieldsProjectForGet(response)
  });

  it('| Get project by ID withot token #smoke', async () => {
    const randomProjectId = await request.getRandomProjectId();
    let response = await request.getProjectByIdWithoutToken(randomProjectId)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });

});

describe('CEM - Projects endpoint smoke /POST', () => {
  let request = new ProjectsAPI(); 
  let requestClients = new ClientsAPI();
  let requestEngagements = new EngagementsAPI();
  let requestUIconfiguration = new UIConfigurationsAPI();

  let body = {
    "projectYear": 0,
    "name": "string",
    "description": "string",
    "type": "string",
    "lineOfBusiness": "string",
    "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mdmClientId": 0
  }

  let bodyNotEmpty = {
    "projectYear": 0,
    "name": "string",
    "description": "string",
    "type": "string",
    "lineOfBusiness": "string",
    "scheduledStartDate": "2021-09-23T15:31:04.739Z",
    "scheduledEndDate": "2021-09-23T15:31:04.739Z",
    "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mdmClientId": 0
  }

  let bodyEngagement = {
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

  let bodyForUpdateEngagement = {
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

  let newBodyPost
  let clientId
  let timestamp
  let randomEngagementID

  it('207393 |POST /projects with all blank schema values: with attributes without values #smoke', async () => {
    body.name = ""
    body.description = ""
    body.lineOfBusiness = ""
    body.type = ""
    body.engagementId = ""
    body.projectYear = ""

    newBodyPost = JSON.stringify(body)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
  });

  it(' |POST /projects with all blank schema values: with attributes without values without token #smoke', async () => {
    body.name = ""
    body.description = ""
    body.lineOfBusiness = ""
    body.type = ""
    body.engagementId = ""
    body.projectYear = ""

    newBodyPost = JSON.stringify(body)

    const response = await request.postProjectsWithoutToken(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });


  it('207889 |POST /projects with all valid schema values - max Year boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus)
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);

    bodyNotEmpty.projectYear = validYearMax
    bodyNotEmpty.name = maxLengthName
    bodyNotEmpty.description = maxLengthDescription
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsProjectForPost(response, bodyNotEmpty)
  });

  it('207889 |POST /projects with all valid schema values - with all LOB and Types', async () => {
    projectTypesWithGroups = await requestUIconfiguration.getUiConfigurationsForProjectssOnly()

    for (const projectType of projectTypesWithGroups) {

    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus)
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()


    bodyNotEmpty.projectYear = validYearMax
    bodyNotEmpty.name = "Name_"+ timestamp
    bodyNotEmpty.description = ""
    bodyNotEmpty.lineOfBusiness = projectType.group
    bodyNotEmpty.type = projectType.name
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsProjectForPost(response, bodyNotEmpty)
    }
    // Verifications for all valid combinations for LOB and Type
  }).timeout(200000);

  it('207889 |POST /projects with all valid schema values - min Year boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const responseTest = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(responseTest, statusCode.OK)

    utilsCem.verifyAllfieldsProjectForPost(responseTest, bodyNotEmpty)
  });

  it('207889 |POST /projects with  INvalid schemnewBodyPosta values - min Year boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = invalidYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207889 |POST /projects with  INvalid schema values - max Year boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = invslidYearMax
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207392-5 |POST /projects with  INvalid schema values - too Long Name boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = tooLongString
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207392-6 |POST /projects with  INvalid schema values - too Long Name boarder #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = tooLongDescription
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207430 |POST /projects with  INvalid schema values - scheduledStartDate > scheduledEndDate  #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = todayPlusOne
    bodyNotEmpty.scheduledEndDate = today
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)


  });

  it('207430 |POST /projects with  INvalid schema values - scheduledStartDate = scheduledEndDate  #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = todayPlusOne
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)


  });

  it('234874 |POST Its forbidden to create project for engagement with No Active status #smoke', async () => {
    clientId = await requestClients.getRandomClientId();
    timestamp = Date.now()

    bodyEngagement.name = "name_" + timestamp
    bodyEngagement.description = ''
    bodyEngagement.lineOfBusiness = "Tax"
    bodyEngagement.type = 'Tax Return'
    bodyEngagement.scheduledStartDate = todayPlusOne
    bodyEngagement.scheduledEndDate = tomorrowPlus
    bodyEngagement.mdmClientId = clientId
    bodyEngagement.sow = ''
    bodyEngagement.sowDate = today

    newBodyPost = JSON.stringify(bodyEngagement)

    // POst New Engagement and remember its ID
    const response = await requestEngagements.postEngagements(newBodyPost)
    const engagementID = response.body.id


    //Update engagement with No active status
    bodyForUpdateEngagement.id = engagementID
    bodyForUpdateEngagement.name = "name_" + timestamp
    bodyForUpdateEngagement.description = ''
    bodyForUpdateEngagement.lineOfBusiness = "Tax"
    bodyForUpdateEngagement.type = 'Tax Return'
    bodyForUpdateEngagement.scheduledStartDate = todayPlusOne
    bodyForUpdateEngagement.scheduledEndDate = tomorrowPlus
    bodyForUpdateEngagement.mdmClientId = clientId
    bodyForUpdateEngagement.sow = ''
    bodyForUpdateEngagement.sowDate = today
    bodyForUpdateEngagement.status = "Inactive"
    newBodyForUpdate = JSON.stringify(bodyForUpdateEngagement)
    await requestEngagements.updateEngagement(engagementID, newBodyForUpdate)

    //Create project for No active Engagement
    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = engagementID
    bodyNotEmpty.mdmClientId = clientId

    const newBodyProject = JSON.stringify(bodyNotEmpty)

    const responseForProject = await request.postProjects(newBodyProject)
    utils.checkIfStatusCodeIsEqual(responseForProject, statusCode.UNPROCESSABLE_ENTITY)

  });



  it('207402 |POST /projects  project creation with the same name is allowed within one client(different Engagements) #smoke', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);

    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)


    bodyNotEmpty.engagementId = await requestEngagements.getNewEngagementIDinContextOfClient(clientId, randomEngagementID)

    newBodyForUpdate = JSON.stringify(bodyNotEmpty)
    const responseWithTheSameName = await request.postProjects(newBodyForUpdate)
    utils.checkIfStatusCodeIsEqual(responseWithTheSameName, statusCode.OK)
  });

  it('207401 |POST /projects  NO project creation with the same name is allowed with the same engagement ', async () => {
    randomEngagementID = await requestEngagements.getEngagementIdWithDefinedStatus(activeStatus);
    console.log("ACTIVE ENGAGEMENT" + randomEngagementID)
    clientId = await requestEngagements.getEngagementClientID(randomEngagementID);
    timestamp = Date.now()

    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = randomEngagementID
    bodyNotEmpty.mdmClientId = clientId

    newBodyPost = JSON.stringify(bodyNotEmpty)

    const response = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsProjectForPost(response, bodyNotEmpty)

    const responseWithTheSameName = await request.postProjects(newBodyPost)
    utils.checkIfStatusCodeIsEqual(responseWithTheSameName, statusCode.UNPROCESSABLE_ENTITY)
  });

});
describe('CEM - Projects endpoint smoke /PUT', () => {
  let request = new ProjectsAPI(); 
  let requestClients = new ClientsAPI();
  let requestEngagements = new EngagementsAPI();
  // let requestUIconfiguration = new UIConfigurationsAPI();

  let body = {
    "projectYear": 0,
    "name": "string",
    "description": "string",
    "type": "string",
    "lineOfBusiness": "string",
    "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mdmClientId": 0
  }

  let bodyNotEmpty = {
    "projectYear": 0,
    "name": "string",
    "description": "string",
    "type": "string",
    "lineOfBusiness": "string",
    "scheduledStartDate": "2021-09-23T15:31:04.739Z",
    "scheduledEndDate": "2021-09-23T15:31:04.739Z",
    "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mdmClientId": 0
  }

  let bodyForUpdate = {
    "id": "",
    "projectYear": 0,
    "name": "string",
    "description": "string",
    "type": "string",
    "lineOfBusiness": "string",
    "scheduledStartDate": "2021-09-23T15:31:04.739Z",
    "scheduledEndDate": "2021-09-23T15:31:04.739Z",
    "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mdmClientId": 0,
    "status": ""
  }

  let bodyEngagement = {
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

  let bodyForUpdateEngagement = {
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
  let clientId
  let timestamp
  let randomProjectID


  it('207398 |PUT /projects with all blank schema values: with attributes without values #smoke', async () => {
    randomProjectID = await request.getRandomProjectId()
    newBody = JSON.stringify(body)
    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)
  });

  it('|PUT /projects with all blank schema values: with attributes without values without token #smoke', async () => {
    randomProjectID = await request.getRandomProjectId()
    newBody = JSON.stringify(body)
    const response = await request.updateProjectWithoutToken(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });


  it('207889 |PUT /projects with all valid schema values - max Year boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);

    let response = await request.getProjectById(randomProjectID)
    const projectStatus = response.body.status
    let projectStatusForUpdate
    let ptojectLOBForUpdate
    let projectType
    if (projectStatus == "Active") {
      projectStatusForUpdate = "Inactive"
    } else {
      projectStatusForUpdate = "Active"
    }

    const projectLineOfBusiness = response.body.lineOfBusiness
    if (projectLineOfBusiness == "Audit") {
      ptojectLOBForUpdate = "Tax"
      projectType = "Tax Return"
    } else {
      ptojectLOBForUpdate = "Audit"
      projectType = "Audit"
    }

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMax
    bodyForUpdate.name = maxLengthNameForUpdate
    bodyForUpdate.description = maxLengthDescription
    bodyForUpdate.lineOfBusiness = ptojectLOBForUpdate
    bodyForUpdate.type = projectType
    bodyForUpdate.scheduledStartDate = today
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId
    bodyForUpdate.status = projectStatusForUpdate


    newBody = JSON.stringify(bodyForUpdate)

    const responseForUpdate = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(responseForUpdate, statusCode.OK)
    utilsCem.verifyAllfieldsProjectForUpdate(responseForUpdate, bodyForUpdate)
  });

  it('207396 |PUT /projects with all valid schema values - min Year boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = maxLengthDescription
    bodyForUpdate.scheduledStartDate = today
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId
    bodyForUpdate.status = activeStatus


    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)

    utilsCem.verifyAllfieldsProjectForUpdate(response, bodyForUpdate)
  });

  it('207889 |PUT /projects with  INvalid schema values - min Year boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = invalidYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = maxLengthDescription
    bodyForUpdate.scheduledStartDate = today
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId


    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207889 |PUT /projects with  INvalid schema values - max Year boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = invslidYearMax
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = today
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207392-5 |PUT /projects with  INvalid schema values - too Long Name boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = tooLongString
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207392-6 |PUT /projects with  INvalid schema values - too Long Description boarder #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = tooLongDescription
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207430 |PUT /projects with  INvalid schema values - scheduledStartDate > scheduledEndDate  #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = today
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)


  });

  it('207430 |PUT /projects with  INvalid schema values - scheduledStartDate = scheduledEndDate  #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(randomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207647 |PUT Its forbidden to Update project for engagement with No Active status #smoke', async () => {
    clientId = await requestClients.getRandomClientId();
    timestamp = Date.now()

    bodyEngagement.name = "name_" + timestamp
    bodyEngagement.description = ''
    bodyEngagement.lineOfBusiness = "Tax"
    bodyEngagement.type = 'Tax Return'
    bodyEngagement.scheduledStartDate = todayPlusOne
    bodyEngagement.scheduledEndDate = tomorrowPlus
    bodyEngagement.mdmClientId = clientId
    bodyEngagement.sow = ''
    bodyEngagement.sowDate = today

    newBody = JSON.stringify(bodyEngagement)

    // POst New Engagement and remember its ID
    const response = await requestEngagements.postEngagements(newBody)
    const engagementID = response.body.id

    //Post new Project for this Engagement
    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = engagementID
    bodyNotEmpty.mdmClientId = clientId

    const newBodyProject = JSON.stringify(bodyNotEmpty)

    const responseForProject = await request.postProjects(newBodyProject)
    const projectId = responseForProject.body.id

    //Update engagement with No active status
    bodyForUpdateEngagement.id = engagementID
    bodyForUpdateEngagement.name = "name_" + timestamp
    bodyForUpdateEngagement.description = ''
    bodyForUpdateEngagement.lineOfBusiness = "Tax"
    bodyForUpdateEngagement.type = 'Tax Return'
    bodyForUpdateEngagement.scheduledStartDate = todayPlusOne
    bodyForUpdateEngagement.scheduledEndDate = tomorrowPlus
    bodyForUpdateEngagement.mdmClientId = clientId
    bodyForUpdateEngagement.sow = ''
    bodyForUpdateEngagement.sowDate = today
    bodyForUpdateEngagement.status = "Inactive"
    newBodyForUpdate = JSON.stringify(bodyForUpdateEngagement)
    await requestEngagements.updateEngagement(engagementID, newBodyForUpdate)

    //Update project for No active Engagement
    bodyNotEmpty.id = projectId
    bodyNotEmpty.projectYear = validYearMin
    bodyNotEmpty.name = "Name_" + timestamp
    bodyNotEmpty.description = "description_" + timestamp
    bodyNotEmpty.lineOfBusiness = "Audit"
    bodyNotEmpty.type = "Audit"
    bodyNotEmpty.scheduledStartDate = today
    bodyNotEmpty.scheduledEndDate = todayPlusOne
    bodyNotEmpty.engagementId = engagementID
    bodyNotEmpty.mdmClientId = clientId

    const newBodyProjectForUpdate = JSON.stringify(bodyNotEmpty)

    const responseForProjectUpdate = await request.updateProject(projectId,newBodyProjectForUpdate)
    utils.checkIfStatusCodeIsEqual(responseForProjectUpdate, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207391 -1  | PUT /projects/{id} with invalid id  #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = wrongGuidProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(wrongGuidProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)

  });

  it('207391 -2  | PUT /projects/{id} with inconsistent id  #smoke', async () => {
    randomProjectID = await request.getRandomProjectId();
    newRandomProjectID = await request.getNewProjectIDinContextOfEngagement();
        clientId = await request.getProjectMdmClientID(randomProjectID);
    engagementId = await request.getProjectEngagementID(randomProjectID);
    newRandomProjectID = await request.getNewProjectIDinContextOfEngagement(engagementId,randomProjectID);
    timestamp = Date.now()

    bodyForUpdate.id = randomProjectID
    bodyForUpdate.projectYear = validYearMin
    bodyForUpdate.name = "Name_" + timestamp
    bodyForUpdate.description = "description_" + timestamp
    bodyForUpdate.lineOfBusiness = "Audit"
    bodyForUpdate.type = "Audit"
    bodyForUpdate.scheduledStartDate = todayPlusOne
    bodyForUpdate.scheduledEndDate = todayPlusOne
    bodyForUpdate.engagementId = engagementId
    bodyForUpdate.mdmClientId = clientId

    newBody = JSON.stringify(bodyForUpdate)

    const response = await request.updateProject(newRandomProjectID, newBody)
    utils.checkIfStatusCodeIsEqual(response, statusCode.BAD_REQUEST)

  });

  describe('CEM - Projects PUT /legalEntity', () => {
    let request = new ProjectsAPI()
    let request_entities = new LegalEntitiesAPI()

    let randomProjectId
    let legalEntities
    let randomEntity_ClientId

    before(async() => {
      randomEntity_ClientId = await request_entities.getRandomLegalEntityMdmClientId()
      let entitiesResponse = await request_entities.getLegalEntitiesForOneClient(randomEntity_ClientId)
      legalEntities = entitiesResponse.body.results
      randomProjectId = await request.getRandomProjectIdForMdmClientId(randomEntity_ClientId)
      
      if(legalEntities.length > 0){
        legalEntityId_1 = legalEntities[0].id
      }

      if(legalEntities.length > 1){
        legalEntityId_2 = legalEntities[1].id
      }
      else{
        console.log('There is only one entity available.')
      }

      if(legalEntities.length > 2){
        legalEntityId_3 = legalEntities[2].id
      }
      else{
        console.log('There is only two entities available.')
      }

      //clear assigned entities to a project
      let body = utilsCem.generatePutLegalEntityToProjectBody([])
      await request.putLegalEntityIntoProject(randomProjectId, body)
    })

    it('238757 | API call allows to assign ONE entity to a particular project #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [legalEntityId_1])
    });

    it('238784 | When the new entity is assigned to the client, GET ​/api​/v1​/Projects​/{id}​/legalEntity response is updated with new entity(s) #smoke', async () => {
      let response = await request.getLegalEntitiesForProject(randomProjectId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyLegalEntitiesForProjectFields(response.body.results, [legalEntityId_1], randomProjectId)
    });

    it('238280, 238759 | API request is called to assign/un-assign an array of a given client\'s legal entities to a project within that client #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_2, legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [legalEntityId_2, legalEntityId_3])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [legalEntityId_1])
    });

    it('236364, 236057 | API call allows to assign A SCOPE of entities to a particular project #smoke', async () => {
      let body_clear = utilsCem.generatePutLegalEntityToProjectBody([])
      await request.putLegalEntityIntoProject(randomProjectId, body_clear)
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_2, legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [legalEntityId_2, legalEntityId_3])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [])
    });

    it('238758 | Request body should always contain the ids of Legal entities already assigned to the project #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1, legalEntityId_2, legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [legalEntityId_1])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [])
    });

    it('238302 | When the request body contains all the entities assigned, the system will return an empty response #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1, legalEntityId_2, legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [])
    });

    it('238279 | GET ​/api​/v1​/Projects​/{id}​/legalEntity is able to be called to get all legal entities for a given project #smoke', async () => {
      let response = await request.getLegalEntitiesForProject(randomProjectId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyLegalEntitiesForProjectFields(response.body.results, [legalEntityId_1, legalEntityId_2, legalEntityId_3], randomProjectId)
    });

    it('236365 | It\'s possible to un-assign ONE given client\'s legal entities from a project within an API call #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_2, legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [legalEntityId_1])
    });

    it('238797 | When the new entity is UN-assigned to the client, the entity is no sent in GET ​/api​/v1​/Projects​/{id}​/legalEntity response #smoke', async () => {
      let response = await request.getLegalEntitiesForProject(randomProjectId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyLegalEntitiesForProjectFields(response.body.results, [legalEntityId_2, legalEntityId_3], randomProjectId)
    });

    it('236054, 236071 | It\'s possible to un-assign an array of a given client\'s legal entities from a project within an API call #smoke', async () => {
      let body_update = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1, legalEntityId_2, legalEntityId_3])
      await request.putLegalEntityIntoProject(randomProjectId, body_update)
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_3])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [legalEntityId_1, legalEntityId_2])
    });

    it('238296 | When an empty request is sent, the system unassigns all the assigned entities #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      console.log(response.body)
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyAssignedEntitiesToProject(response, [])
      utilsCem.verifyUnassignedEntitiesFromProject(response, [legalEntityId_3])
    });

    it('241934 | It\'s impossible to assign the entity to the client it isn\'t related', async () => {
      let request_clients = new ClientsAPI()
      let differentClient

      //get different client for project
      let listOfClientsResponse = await request_clients.getClients()
      let listOfClients = listOfClientsResponse.body.results
      if(listOfClients[0].mdmClientId == randomEntity_ClientId){
        differentClient = listOfClients[1].mdmClientId
      }
      else{
        differentClient = listOfClients[0].mdmClientId
      }

      let differentProject = await request.getRandomProjectIdForMdmClientId(differentClient)
      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1, legalEntityId_2])
      let response = await request.putLegalEntityIntoProject(differentProject, body)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
    });

    //this test case is not applicable for now, as there are no clear requirements if this should be possible to assign entity to inactive project
    it('241936 / Bug 242056 | It\'s impossible to assign the entity to the inactive project', async () => {
      let engagementId = await request.getProjectEngagementID(randomProjectId)
      let timestamp = Date.now()
      let bodyForUpdate = {
        "id": randomProjectId,
        "projectYear": validYearMin,
        "name": "Name_" + timestamp,
        "description": "description_" + timestamp,
        "type": "Audit",
        "lineOfBusiness": "Audit",
        "scheduledStartDate": today,
        "scheduledEndDate": todayPlusOne,
        "engagementId": engagementId,
        "mdmClientId": randomEntity_ClientId,
        "status": "Inactive"
      }

      let response_projects = await request.updateProject(randomProjectId, bodyForUpdate)
      utils.checkIfStatusCodeIsEqual(response_projects, statusCode.OK)

      let body = utilsCem.generatePutLegalEntityToProjectBody([legalEntityId_1])
      let response = await request.putLegalEntityIntoProject(randomProjectId, body)

      //clear project data
      bodyForUpdate.status = "Active"
      response_projects = await request.updateProject(randomProjectId, bodyForUpdate)
      utils.checkIfStatusCodeIsEqual(response_projects, statusCode.OK)

      utils.checkIfStatusCodeIsNotEqual(response, statusCode.OK)
      // utils.verifyAssignedEntitiesToProject(response, [legalEntityId_1])
    });

    it('242927 | PUT request ​/api​/v1​/Projects​/{id}​/legalEntity without token returns 401 status code #smoke', async () => {
      let body = utilsCem.generatePutLegalEntityToProjectBody([])
      let response = await request_API.request_cem.put(projects + '/' + randomProjectId + '/legalEntity').send(body)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
    });

    it('242928 | GET request ​/api​/v1​/Projects​/{id}​/legalEntity without token returns 401 status code #smoke', async () => {
      let response = await request_API.request_cem.get(projects + '/' + randomProjectId + '/legalEntity')

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
    });
  });
});