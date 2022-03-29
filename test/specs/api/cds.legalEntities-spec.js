const statusCode = require('../../../constants/status-code')
const data = require('../../../data/cds.legalEntities')
const Str = require('@supercharge/strings')

const ClientsAPI = require('../../../src/api/cds.clientsAPI')
const LegalEntitiesAPI = require('../../../src/api/cds.legalEntitiesAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCDS = require('../api/utilities/utilities-CDS')
const config = require('../../../data/config')
let utils = new Utilities()
let utilsCds = new UtilitiesCDS()

describe('CDS - Legal Entities endpoint verification', () => {

    let request = new LegalEntitiesAPI()
    let request_clients = new ClientsAPI()

    let randomClientId

    before(async() => {
        randomClientId = await request_clients.getRandomMasterClientId_7Digit()
        console.log("Random client ID: " + randomClientId)
    });

    describe('CDS - Legal Entities POST /bulkinsert', () => {
        let updateData

        it('230812, 230873, 230814 | Sets a list of entities into CDS DB successfully | Entity type can be one of a five values: "Individual", "C-Corp", "S-Corp", "Partnership", "Trust" | If a record passes the validation and is a unique (No such MasterCLientID and EntityClientID in DB) then it\'s inserted into the DB #smoke', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', data.entityTypes)

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, data.entityTypes.length, 0, 0)
        });

        it('230820, 230813 | Master client number is a required value | When a record do not pass any validation rule then it\'s rejected by the system and validation rule is shown why it\'s rejected', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            delete body.legalEntities[0].mdmMasterClientId

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230821 | Master client number is a number value', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody('randomClient', 'S', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230822 | Master client number is a 7 digits number exactly', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(123456, 'S', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230823, 230830 | Master client number is not obligatory unique | Legal entity ID is NOT required', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230831 | Legal entity ID is unique across all clients in DB', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]], true)
            body.legalEntities[0].mdmLegalEntityId = '0123456'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('230815, 243389 | If a record passes the validation and is NOT unique (such MasterCLientID and EntityClientID exist in DB) then it\'s updated inthe DB | check the record is updated when MasterClientids and LegalentitiesIDs match in the uploaded entity and existent in DB', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]], true)
            updateData = body
            let response = await request.postLegalEntities(body)
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)

            updateData.legalEntities[0].name += 'Updated'
            let response_updated = await request.postLegalEntities(updateData)
            utils.checkIfStatusCodeIsEqual(response_updated, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response_updated, 0, 1, 0)
        });

        it('230833 | Legal entity ID consists of 7 digits data length exactly', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]], true)
            body.legalEntities[0].mdmLegalEntityId += '1'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230834 | Legal entity ID is numeric (no alpa or special chars)', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]], true)
            body.legalEntities[0].mdmLegalEntityId = '1234abc'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230823, 230830 | Master client number is not obligatory unique | Legal entity ID is NOT required', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });
        
        it('230837 | Legal entity Name is required if entity type is not equal to "individual"', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[1]])
            delete body.legalEntities[0].name

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230838 | Legal entity Name must contain at least one alpha character when entered', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[1]])
            body.legalEntities[0].name = '123'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230842 | Legal entity Name must contain 256* max data length', async () => {
            const tooLongString = Str.random(257).toString()
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[1]])
            body.legalEntities[0].name = tooLongString

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230843 | First Name is required when entity type = individual, not a business', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', ["Individual"])
            delete body.legalEntities[0].firstName

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230844 | First Name is not unique', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            body.legalEntities[0].firstName = 'autoname'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230845 | First Name must contain at least one alpha character when entered', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            body.legalEntities[0].firstName = '123'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230848 | Middle Initial is optional.', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            body.legalEntities[0].middleInitial = ''

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230850 | Middle Initial is not unique', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230852 | Middle Initial has maximum data length of 1 character', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'XY', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230851 - 1 | Middle Initial allows only alphabet characters - digit', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, '1', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            console.log(JSON.stringify(response.body))

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230851 - 2 | Middle Initial allows only alphabet characters - special character', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, '?', [data.entityTypes[0]])

            let response = await request.postLegalEntities(body)

            console.log(JSON.stringify(response.body))

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230853 | MiddleInitial : If Entity Type = "Individual", blank or alpha characters are accepted', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, '', ["Individual"])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230854 | If Entity Type != "Individual", blank or bypass (ignore) Middle Initial values ( do not set in DB but accept)', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'X', [data.entityTypes[2]])

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230855 | Last Name is required when entitytype = individual', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', ["Individual"])
            delete body.legalEntities[0].lastName

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230857, 230870 | Last Name is NOT unique | Entity type is NOT unique', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            body.legalEntities[0].lastName = 'autoname'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230859 | Last Name datatype has 50 characters data length maximum', async () => {
            const tooLongString = Str.random(51).toString()
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[1]])
            body.legalEntities[0].lastName = tooLongString

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230860 | Last Name is required and must contain at least one alpha character if entity type = "Individual"', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', ['Individual'])
            body.legalEntities[0].lastName = '123'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230861 | Last Name can be blank or bypassed (ignored) any value entered if entitytype != individual', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[3]])
            body.legalEntities[0].lastName = ''

            let response = await request.postLegalEntities(body)
            
            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)

        });

        it('230863 | Taxpayer ID is NOT required', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            delete body.legalEntities[0].identificationNumber

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230864, 230867 | Taxpayer ID is NOT unique | Taxpayer ID can accept any inputted value', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            body.legalEntities[0].identificationNumber = 'autoIdentificationNumber'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 1, 0, 0)
        });

        it('230866 | Taxpayer ID has max data length of 50 characters', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', [data.entityTypes[0]])
            const tooLongString = Str.random(51).toString()
            body.legalEntities[0].identificationNumber = tooLongString

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230868 | Entity type is mandatory', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', ['Individual'])
            body.legalEntities[0].entityType = ''

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('230874 | Entity types column is present in the  LegalEntity table and back end checks inserted values that they matched to the required values: "Individual", "C-Corp", "S-Corp", "Partnership", "Trust"', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, 'S', ['Individual'])
            body.legalEntities[0].entityType = 'NotExisting'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('238728 | Records where MDMEntityId = MDMMasterClientID should be rejected by the system', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]], true)
            body.legalEntities[0].mdmLegalEntityId = '1234567'

            let response = await request.postLegalEntities(body)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 0, 1)
        });

        it('238748 - 1 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - name', async () => {
            updateData.legalEntities[0].name += 'Updated'
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('238748 - 2 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - firstName', async () => {
            updateData.legalEntities[0].firstName += 'Updated'
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('238748 - 3 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - middleInitial', async () => {
            updateData.legalEntities[0].middleInitial = 'U'
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('238748 - 4 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - lastName', async () => {
            updateData.legalEntities[0].lastName += 'Updated'
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('238748 - 5 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - identificationNumber', async () => {
            updateData.legalEntities[0].identificationNumber = '3456789'
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });

        it('238748 - 6 | Check update of legal entities - all the values can be updated except MasterclientID and legalentityid - entityType', async () => {
            updateData.legalEntities[0].entityType = data.entityTypes[3]
            let response = await request.postLegalEntities(updateData)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response, 0, 1, 0)
        });
    });

    describe('CDS - Legal Entities GET', () => {

        let randomEntity
        before(async() => {
            randomEntity = await request.getRandomLegalEntity()
        });

        it('228304 | GET /LegalEntities without any filter (empty filtering) #smoke', async () => {
            let response = await request.getAllLegalEntities()

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyAllLegalEntitiesFields(response.body.results)
        });

        it('228298 | filter by a NON existent client', async () => {
            let mdmMasterClientId = config.invalidData.notExistingMdmClientId
            let response = await request.getLegalEntitiesByMdmMasterClientId(mdmMasterClientId)

            utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
        });

        it('228299 | filter by a client with NO value within filter (no clientid)', async () => {
            let mdmMasterClientId = ''
            let response = await request.getLegalEntitiesByMdmMasterClientId(mdmMasterClientId)

            utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY)
        });

        it('228300 | filter by a legal entity name that user has access to', async () => {
            let name = randomEntity.name
            let response = await request.getLegalEntitiesByName(name)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyOneLegalEntityData(response.body.results[0], null, null, name)
        });

        it('228301 | filter by a legal entity name that does NOT exist', async () => {
            let nameNotExisting = randomEntity.name + 'notExisting'
            let response = await request.getLegalEntitiesByName(nameNotExisting)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utils.checkIfResponseResultsAreEmpty(response)
        });

        it('228302 | filter by an empty legal entity name within the filter', async () => {
            let name = ''
            let response = await request.getLegalEntitiesByName(name)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        });

        it('228303 | filter by a legal entity name that exists but user has NO access to', async () => {
            let body = utilsCds.generatePostLegalEntitiesBody(1234567, 'S', [data.entityTypes[0]])
            body.legalEntities[0].name += '0'
            let response_post = await request.postLegalEntities(body)
            utils.checkIfStatusCodeIsEqual(response_post, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response_post, 1, 0, 0)

            let nameNoAccess = body.legalEntities[0].name
            let response = await request.getLegalEntitiesByName(nameNoAccess)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utils.checkIfResponseResultsAreEmpty(response)
        });

        it('239276 | Filter by existent guid ( for a client you have access to)', async () => {
            let guid = randomEntity.id
            let response = await request.getLegalEntitiesByGuid(guid)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyOneLegalEntityData(response.body.results[0], guid)
        });

        it('239277 | Filter by Non-existent guid', async () => {
            let guid = config.invalidData.notExistingProtocolId
            let response = await request.getLegalEntitiesByGuid(guid)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utils.checkIfResponseResultsAreEmpty(response)
        });

        it('239278 | Filter by existent guid (client you have NO access to)', async () => {
            let guid = config.invalidData.noAccessLegalEntityId
            let response = await request.getLegalEntitiesByGuid(guid)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utils.checkIfResponseResultsAreEmpty(response)
        });

        it('239279, 228297 | Filter by existent MDMMasterClientID( for a client you have NO access to) | filter by a client that have NO access to the entity (user role)', async () => {
            let mdmMasterClientId = config.invalidData.notExistingMdmClientId
            let response = await request.getLegalEntitiesByMdmMasterClientId(mdmMasterClientId)

            utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
        });

        it('239294, 228296 | Filter by existent MDMMasterClientID ( for a client you have access to) | filter by a client that have access to the entity (user role)', async () => {
            let mdmMasterClientId = randomEntity.mdmMasterClientId
            let response = await request.getLegalEntitiesByMdmMasterClientId(mdmMasterClientId)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyAllLegalEntitiesFields(response.body.results, mdmMasterClientId)
        });

        it('247977, 247978 | additional attribute \'displayName\' is added into the response schema | if entityType = Individual -> displayName = FirstName + MiddleName. (dot) + Last Name (incl. spaces between names)', async () => {
            let middleInitial = 'S'
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, middleInitial, ['Individual'])
            body.legalEntities[0].name += '1'
            let response_post = await request.postLegalEntities(body)
            utils.checkIfStatusCodeIsEqual(response_post, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response_post, 1, 0, 0)

            let name = body.legalEntities[0].name
            let firstName = body.legalEntities[0].firstName
            let lastName = body.legalEntities[0].lastName
            let displayName = firstName + ' ' + middleInitial + '. ' + lastName
            let response = await request.getLegalEntitiesByName(name)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyAllLegalEntitiesFields(response.body.results)
            utilsCds.verifyOneLegalEntityData(response.body.results[0], null, displayName, name)
        });

        it('247979, 230875 | If entityType = non-Individual ("C-Corp", "S-Corp", "Partnership", "Trust")-> displayName = entityName | set by POST/bulkinsert entities are returned correctly by GET/api/v1/legalentities ', async () => {
            let middleInitial = 'S'
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, middleInitial, [data.entityTypes[2]])
            body.legalEntities[0].name += '2'
            let response_post = await request.postLegalEntities(body)
            utils.checkIfStatusCodeIsEqual(response_post, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response_post, 1, 0, 0)

            let name = body.legalEntities[0].name
            let displayName = name
            let response = await request.getLegalEntitiesByName(name)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyAllLegalEntitiesFields(response.body.results)
            utilsCds.verifyOneLegalEntityData(response.body.results[0], null, displayName, name)
        });

        it('248235 | check displayName doesn\'t contain aditional spaces when no Middle Initial name is inserted', async () => {
            let middleInitial = ''
            let body = utilsCds.generatePostLegalEntitiesBody(randomClientId, middleInitial, ['Individual'])
            body.legalEntities[0].name += '3'
            let response_post = await request.postLegalEntities(body)
            utils.checkIfStatusCodeIsEqual(response_post, statusCode.OK)
            utilsCds.verifyPostLegalEntitiesResponse(response_post, 1, 0, 0)

            let name = body.legalEntities[0].name
            let firstName = body.legalEntities[0].firstName
            let lastName = body.legalEntities[0].lastName
            let displayName = firstName + ' '+ lastName
            let response = await request.getLegalEntitiesByName(name)

            utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
            utilsCds.verifyAllLegalEntitiesFields(response.body.results)
            utilsCds.verifyOneLegalEntityData(response.body.results[0], null, displayName, name)
        });
    });
});