const invalidData = require('../../../data/config').invalidData
const statusCode = require('../../../constants/status-code')

const ProceduresAPI = require('../../../src/api/etl.proceduresAPI');
const ClientsAPI = require('../../../src/api/cem.clientsAPI');
const ApplicationsAPI = require('../../../src/api/etl.applicationsAPI');
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/procedures verification', () => {

  let request = new ProceduresAPI();
  let request_client = new ClientsAPI();
  let request_applications = new ApplicationsAPI();
  
  let clientId
  let applicationId

  before( async() => {
    clientId = await request_client.getRandomClientId();
    let application = await request_applications.getRandomApplication();
    applicationId = application.id;
});
  
  describe('GET /procedures without mdmclientId or applicationId', () => {
    it('231926 | GET /procedures without mdmclientId or applicationId', async () => {
      let response = await request.getAllProceduresWithoutArgs();
      
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });
  });
  
  
  describe('GET /procedures by mdmclientId', () => {
    it('230772 | Get /procedures by valid mdmclientId #smoke', async () => {
      let response = await request.getAllProcedures(clientId)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyAllProceduresFields(response.body.results)
    });


    it('231925 | Get /procedures by mdmclientId = null', async () => {
      let response = await request.getAllProcedures(null)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });

    it('231924 | Get /procedures by mdmclientId = longValue', async () => {
      let response = await request.getAllProcedures(invalidData.longValue)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });

    it('231934 | Get /procedures by mdmclientId = empty', async () => {
      let response = await request.getAllProcedures('')
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });

    it('231935 | Get /procedures by mdmclientId = invalid', async () => {
      let response = await request.getAllProcedures(invalidData.invalidId)

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /procedures by applicationId', () => {
    it('230773 | Get /procedures by valid applicationId  #smoke', async () => {
      let response = await request.getAllProceduresByApplicationId(applicationId)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyAllProceduresFields(response.body.results)
    });

    it('231920 | Get /procedures by applicationId = null -- BUG 236642', async () => {
      let response = await request.getAllProceduresByApplicationId(null)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.FORBIDDEN);
    });

    it('231921 | Get /procedures by applicationId = longValue --BUG 236642', async () => {
      let response = await request.getAllProceduresByApplicationId(invalidData.longValue)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });

    it('231936 | Get /procedures by applicationId = empty', async () => {
      let response = await request.getAllProceduresByApplicationId('')
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });

    it('231922 | Get /procedures by applicationId = invalid -- BUG 236642', async () => {
      let response = await request.getAllProceduresByApplicationId(invalidData.invalidId)
      

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNPROCESSABLE_ENTITY);
    });
  });

  
});