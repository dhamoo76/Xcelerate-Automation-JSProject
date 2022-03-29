const statusCode = require('../../../constants/status-code')

const MatchedFilesAPI = require('../../../src/api/etl.matchedFilesAPI');
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/matchedfiles verification', () => {

  let request = new MatchedFilesAPI();
  let responseLength

  describe('209882 | Get all matched files #smoke', () => {
    it('All matchedfiles (without filtering)', async () => {
      let response = await request.getMatchedFiles()
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)

      firstFile = response.body.results[0]
      responseLength = response.body.results.length
      lastFile = response.body.results[responseLength - 1]
      utilsEtl.verifyAllMatchedFilesFields(response.body.results)
    });
  });

  describe('209882 | Matched files with skip', () => {
    it('Matched files with skip filter - get last matched file', async () => {
      let response = await request.getMatchedFilesWithSkip(responseLength - 1)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      utils.checkSkippedValues(response, responseLength - 1)
      utilsEtl.verifyAllMatchedFilesFields(response.body.results)
    });
  });

  //NOTE: should be skipped for now as feature isn't used by UI
  /*describe('209882 | Matched files with top -- BUG - ???', () => {
    it('Matched files with top filter - get first matched file)', async () => {
      let response = await request.getMatchedFilesWithTop(1)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utils.checkIfResponseResultsAreNotEmpty(response)
      expect(response.body.top, "Response not contains number of top values: " + response.body.top).to.be.equal(1)
      utils.verifyAllMatchedFilesFields(response.body.results)
    });
  });*/
});