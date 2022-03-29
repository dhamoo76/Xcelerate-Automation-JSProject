const statusCode = require('../../../constants/status-code')

const FilesAPI = require('../../../src/api/etl.filesAPI.js')
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/files verification', () => {

  let request = new FilesAPI();


  it('247279 | GET /files #smoke', async () => {
    let response = await request.getAllFiles()

    utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    utils.checkIfResponseResultsAreNotEmpty(response)
    utilsEtl.verifyAllFilesFields(response.body.results)
  });

  it('247944 | GET /files - unauthorized request', async () => {
    let response = await request.getAllFilesWithoutToken()

    utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
  });
});