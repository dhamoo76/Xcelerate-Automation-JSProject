const invalidData = require('../../../data/config').invalidData
const statusCode = require('../../../constants/status-code')
const ClientsAPI = require('../../../src/api/cem.clientsAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCEM = require('../api/utilities/utilities-CEM')
let utils = new Utilities()
let utilsCem = new UtilitiesCEM()

const config = require('../../../data/config')
const API = require('../../../src/api/API')
const request_API = new API()
const clients = config.requests.CEM.clients

  describe('CEM - /Clients endpoint verification', () => {
    let request = new ClientsAPI()
    let randomClientId
    let clientsData
    let notExistingMdmClientId = invalidData.notExistingMdmClientId

    before(async() => {
      randomClientId = await request.getRandomClientId()
    })

    describe('CEM - /Clients GET', () => {
      it('202522 | Get all clients #smoke', async () => {
        response = await request.getClients()
        clientsData = response.body
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCem.verifyAllClientsFields(response.body.results)
      });

      it('238769 | Get all clients - unauthorized request', async () => {
        response = await request_API.request_cem.get(clients)
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });
    
    describe('CEM - /Clients/{MdmClientId} GET', () => {
      it('238770 | Get one client data #smoke', async () => {
        response = await request.getClientById(randomClientId)
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCem.verifyOneClientDataFields(response.body, randomClientId)
      });

      it('238771 | Check wrong MDM Client ID response', async () => {
        response = await request.getClientById(notExistingMdmClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
      });

      it('238772 | Get one client data - unauthorized request', async () => {
        response = await request_API.request_cem.get(clients + '/' + randomClientId)
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });

    describe('CEM - /Clients/{MdmClientId}/permissions GET', () => {
      it('? | Get client permissions #smoke', async () => {
        response = await request.getClientPermissions(randomClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utils.checkIfResponseResultsAreNotEmpty(response)
      });

      it('? | Check wrong MDM Client ID response / Bug 239250', async () => {
        response = await request.getClientPermissions(notExistingMdmClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
      });

      it('? | Get one client permissions - unauthorized request', async () => {
        response = await request_API.request_cem.get(clients + '/' + randomClientId + '/permissions')
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });

    describe('CEM - /Clients/{MdmClientId}/applications GET', () => {
      it('217743 | 231079 | 231081 | 231082 | 231918 | Get client applications #smoke', async () => {
        response = await request.getClientApplications(randomClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCem.verifyClientsApplicationsFields(response.body.results)
      });

      it('238739 | Check wrong MDM Client ID response', async () => {
        response = await request.getClientApplications(notExistingMdmClientId)
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
      });

      it('217741 | Get one client applications - unauthorized request', async () => {
        response = await request_API.request_cem.get(clients + '/' + randomClientId + '/applications')
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });
});