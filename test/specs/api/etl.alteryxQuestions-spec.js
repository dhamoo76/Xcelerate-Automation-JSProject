const statusCode = require('../../../constants/status-code')

const AlteryxQuestionsAPI = require('../../../src/api/etl.alteryxQuestionsAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/alteryxquestions verification', () => {

  let request = new AlteryxQuestionsAPI()

  it('240047 | GET /alteryxquestions #smoke', async () => {
    let response = await request.getAllAlteryxQuestions()

    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    utils.checkIfResponseResultsAreNotEmpty(response)
    utilsEtl.verifyAllAlteryxQuestionsFields(response.body.results)
  });

  it('247897 | GET /alteryxquestions - unauthorized request', async () => {
    let response = await request.getAllAlteryxQuestionsWithoutToken()

    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });
});