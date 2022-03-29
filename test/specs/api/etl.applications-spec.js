const statusCode = require('../../../constants/status-code')

const ApplicationsAPI = require('../../../src/api/etl.applicationsAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/applications verification', () => {

  let request = new ApplicationsAPI()

  describe('230346 | Get all applications #smoke', () => {
    it('All applications (without filtering)', async () => {
      let response = await request.getApplications()

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utilsEtl.verifyAllApplicationsFields(response.body.results)
    });
  });
});