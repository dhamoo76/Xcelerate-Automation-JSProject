const statusCode = require('../../../constants/status-code')

const ProtocolTypesAPI = require('../../../src/api/etl.protocolTypesAPI.js');
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/protocolTypes verification', () => {

  let request = new ProtocolTypesAPI();


  it('222737 | GET /protocolTypes #smoke', async () => {
    let response = await request.getAllProtocolTypes()

    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    utils.checkIfResponseResultsAreNotEmpty(response)
    utilsEtl.verifyAllProtocolTypesFields(response.body.results)
  });
});