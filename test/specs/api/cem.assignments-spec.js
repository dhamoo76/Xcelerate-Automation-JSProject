const statusCode = require('../../../constants/status-code')

const AssignmentsAPI = require('../../../src/api/cem.assignmentsAPI')
const ClientsAPI = require('../../../src/api/cem.clientsAPI')
const UserRolesAPI = require('../../../src/api/cem.userRolesAPI')
const UsersAPI = require('../../../src/api/cem.usersAPI')
const ProjectsAPI = require('../../../src/api/cem.projectsAPI')
const LegalEntitiesAPI = require('../../../src/api/cem.legalEntitiesAPI')
const EngagementsAPI = require('../../../src/api/cem.engagementsAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCEM = require('../api/utilities/utilities-CEM')
let utils = new Utilities()
let utilsCem = new UtilitiesCEM()
const config = require('../../../data/config')
const API = require('../../../src/api/API')
const request_API = new API()
const assignments = config.requests.CEM.assignments

const date = new Date()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const today = date.toISOString()
const todayPlusOne = tomorrow.toISOString()

describe('CEM - Assignments endpoint verification', () => {

    let request = new AssignmentsAPI()
    let request_clients = new ClientsAPI()
    let request_userRoles = new UserRolesAPI()
    let request_users = new UsersAPI()
    let request_projects = new ProjectsAPI()
    let request_entities = new LegalEntitiesAPI()
    let request_engagements = new EngagementsAPI()

    let randomClientId
    let randomUserRoleId
    let randomUserId
    let randomProjectId
    let randomEntityId
    let randomEngagementId
    let newAssignmentIdsTable = []

    let engagementBody_update = {}

    describe('Assignments regression - POST Assignments', () => {

        before(async() => {
            let randomClient = await request_clients.getRandomClientData()
            randomClientId = await request_clients.getRandomClientId(randomClient)
            console.log("Random client ID: " + randomClientId)
            randomUserRoleId = await request_userRoles.getRandomUserRoleId()
            console.log("Random user role ID: " + randomUserRoleId)
            randomUserId = await request_users.getRandomUserIdByMdmClientId(randomClientId)
            console.log("Random user ID: " + randomUserId)
            randomProjectId = await request_projects.getRandomProjectIdForMdmClientId(randomClientId)
            console.log("Random project ID: " + randomProjectId)
            randomEngagementId = await request_engagements.getRandomEngagementIdForMdmClientId(randomClient.mdmClientId)
            console.log("Random engagement ID: " + randomEngagementId)
            randomEntityId = await request_entities.getRandomLegalEntityId()
            console.log("Random entity ID: " + randomEntityId)
        });

        it('230343 - 1 | Check assignment can be created - create assignment to client #smoke', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, null, null, [randomClientId])

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCem.verifyIfAssignmentWasCreated(response)

            utils.addElementToTable(newAssignmentIdsTable, response.body.id)
        });

        ////////////

        it('230343 - 1 | Check assignment cant be created without token #smoke', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, null, null, [randomClientId])

            let response = await request.postAssignmentsWithoutToken(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)

        });

        it('230343 - 2 | Check assignment can be created - create assignment to engagement #smoke', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, null, [randomEngagementId], null)

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCem.verifyIfAssignmentWasCreated(response)

            utils.addElementToTable(newAssignmentIdsTable, response.body.id)
        });

        it('230343 - 3 | Check assignment can be created - create assignment to project #smoke', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], [randomProjectId], null, null, null)

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCem.verifyIfAssignmentWasCreated(response)

            utils.addElementToTable(newAssignmentIdsTable, response.body.id)
        });

        it('230343 - 4 | Check assignment can be created - create assignment to entity #smoke', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, [randomEntityId], null, null)

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCem.verifyIfAssignmentWasCreated(response)

            utils.addElementToTable(newAssignmentIdsTable, response.body.id)
        });

        it('230342 - 1 | Check validation appears when NO object/role or a user is selected in the chain - no object to assign', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, null, null, null)

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
            // utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, null, '', 'At least one object must by included into the body')
        });

        it('230342 - 2 | Check validation appears when NO object/role or a user is selected in the chain - no role to assign', async () => {
            let body = utilsCem.generateAssignmentsBody(null, [randomUserId], [randomProjectId], null, null, null)

            let response = await request.postAssignments(body)
            utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'roleIds', "'Role Ids' must not be empty.")
        });

        it('230342 - 3 | Check validation appears when NO object/role or a user is selected in the chain - no user to assign', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], null, [randomProjectId], null, null, null)

            let response = await request.postAssignments(body)
            utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userIds', "'User Ids' must not be empty.")
        });

        it('230344 | Check duplicate assignment is not allowed / Bug 229813', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], [randomProjectId], null, null, null)

            let response = await request.postAssignments(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCem.verifyIfAssignmentWasCreated(response)
            utils.addElementToTable(newAssignmentIdsTable, response.body.id)

            let response_duplicate = await request.postAssignments(body)
            //duplicates are not verified on BE side - bug here
            utils.addElementToTable(newAssignmentIdsTable, response_duplicate.body.id)
            utils.checkIfStatusCodeIsNotEqual(response_duplicate, statusCode.OK)
        });

        it('230345 - 1 | Check no assignments to INACTIVE objects are allowed - engagement', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], null, null, [randomEngagementId], null)

            let engagementData_response = await request_engagements.getEngagementById(randomEngagementId)
            let engagementData = engagementData_response.body
            engagementBody_update.name = engagementData.name
            engagementBody_update.description = engagementData.description
            engagementBody_update.lineOfBusiness = engagementData.lineOfBusiness
            engagementBody_update.type = engagementData.type
            engagementBody_update.scheduledStartDate = engagementData.scheduledStartDate
            engagementBody_update.scheduledEndDate = engagementData.scheduledEndDate
            engagementBody_update.id = engagementData.id
            engagementBody_update.status = 'Inactive'

            let response_update = await request_engagements.updateEngagement(randomEngagementId, engagementBody_update)
            utils.checkIfStatusCodeIsEqual(response_update, statusCode.OK)

            let response = await request.postAssignments(body)
            utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'status', "The engagement " + '`' + randomEngagementId + '` is not active.')
        });

        //@TODO
        //not every client has legal entities assigned - to be updated in the future
/*
        it('230345 - 2 | Check no assignments to INACTIVE objects are allowed - entity', async () => {
            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], null, [randomProjectId], null, null, null)

            let response = await request.postAssignments(body)
            utils.checkValidationError(response, statusCode.UNPROCESSABLE_ENTITY, 'Input validation failed', 'userIds', "'User Ids' must not be empty.")
        });
*/

        it('230345 - 3 | Check no assignments to INACTIVE objects are allowed - project', async () => {
            let engagementId = await request_projects.getProjectEngagementID(randomProjectId)
            let timestamp = Date.now()
            let bodyForUpdate = {
              "id": randomProjectId,
              "projectYear": 2020,
              "name": "Name_" + timestamp,
              "description": "description_" + timestamp,
              "type": "Audit",
              "lineOfBusiness": "Audit",
              "scheduledStartDate": today,
              "scheduledEndDate": todayPlusOne,
              "engagementId": engagementId,
              "mdmClientId": randomClientId,
              "status": "Inactive"
            }

            let response_projects = await request_projects.updateProject(randomProjectId, bodyForUpdate)
            utils.checkIfStatusCodeIsEqual(response_projects, statusCode.OK)

            let body = utilsCem.generateAssignmentsBody([randomUserRoleId], [randomUserId], [randomProjectId], null, null, null)
            let response = await request.postAssignments(body)

            //clear project data
            bodyForUpdate.status = "Active"
            response_projects = await request_projects.updateProject(randomProjectId, bodyForUpdate)
            utils.checkIfStatusCodeIsEqual(response_projects, statusCode.OK)

            utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
        });

        it('243530 | POST/assignments - request without token returns 401 status code', async () => {
            let response = await request_API.request_cem.post(assignments).send({})
      
            utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
          });

        it('Clear assignments data', async () => {
            let response = await request.deleteAssignments(newAssignmentIdsTable)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        });

        it('Clear engagements data', async () => {
            engagementBody_update.status = 'Active'

            let response_update = await request_engagements.updateEngagement(randomEngagementId, engagementBody_update)
            utils.checkIfStatusCodeIsEqual(response_update, statusCode.OK)
        });
    });
});