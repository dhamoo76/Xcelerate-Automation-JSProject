const invalidData = require('../../../data/config').invalidData
const statusCode = require('../../../constants/status-code')
const ClientsAPI = require('../../../src/api/cds.clientsAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCDS = require('../api/utilities/utilities-CDS')
let utils = new Utilities()
let utilsCds = new UtilitiesCDS()

const config = require('../../../data/config')
const API = require('../../../src/api/API')
const request_API = new API()
const clients = config.requests.CDS.clients

  describe('CDS - /clients endpoint verification', () => {
    let request = new ClientsAPI()
    let randomClientId
    let clientsData
    let notExistingMdmClientId = invalidData.notExistingMdmClientId

    before(async() => {
      randomClientId = await request.getRandomClientId()
    })

    describe('CDS - /clients GET', () => {
      it('217745, 218092, 223305, 224326 | Get all clients #smoke', async () => {
        response = await request.getClients()
        clientsData = response.body
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCds.verifyAllClientsFields(response.body.results)
      });

      it('257872 | Filter by a existing mdmClientId #smoke', async () => {
        response = await request.getClientsByMdmClientId(randomClientId)
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCds.verifyOneClientDataFields(response.body.results[0], randomClientId)
      });

      it('257873 |  Filter by a NON existent mdmClientId', async () => {
        response = await request.getClientsByMdmClientId(notExistingMdmClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
      });

      it('241615 | Check on non authorized request', async () => {
        response = await request_API.request_cds.get(clients)
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });

    describe('CDS - /clients/{id} GET', () => {
      it('202518 | get a client with existent  clientID #smoke', async () => {
        response = await request.getClientById(randomClientId)
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCds.verifyOneClientDataFields(response.body, randomClientId)
      });

      it('202519 | Get a client with NON existent clientId', async () => {
        response = await request.getClientById(notExistingMdmClientId)

        utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN)
      });

      it('241616 | Check on non authorized request', async () => {
        response = await request_API.request_cds.get(clients + '/' + randomClientId)
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });

});