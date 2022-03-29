const statusCode = require('../../../constants/status-code')

const AlteryxjobAPI = require('../../../src/api/etl.alteryxjobAPI')
const MatchedFilesAPI = require('../../../src/api/etl.matchedFilesAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/alteryxjob verification', () => {

  let request = new AlteryxjobAPI()
  let request_matchedFiles = new MatchedFilesAPI()
  let randomAlteryxJob

  describe('GET all AlteryX jobs #smoke', () => {
    it('232899 | All alteryX jobs (without filtering)', async () => {
        let response = await request.getAlteryxjobs()

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utils.checkIfResponseResultsAreNotEmpty(response)
        utilsEtl.verifyAllAlteryxJobFields(response.body.results)
    });
  });

  describe('PUT AlteryX job #smoke', () => {
    it('232900 - 1 | Update alteryXJobDisposition', async () => {
        randomAlteryxJob = await request.getRandomAlteryxjob()
        const updatedAlteryxjob = {"alteryXJobStatuses": [{}]}
        updatedAlteryxjob.alteryXJobStatuses[0].id = randomAlteryxJob.id
        updatedAlteryxjob.alteryXJobStatuses[0].alteryXJobDisposition = 'Error'

        let response = await request.updateAlteryxjob(updatedAlteryxjob)

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsEtl.verifyPutAlteryxJobResponse(response)
    });

    it('232900 - 2 | Update alteryXJobStatus', async () => {
        randomAlteryxJob = await request.getRandomAlteryxjob()
        const updatedAlteryxjob = {"alteryXJobStatuses": [{}]}
        updatedAlteryxjob.alteryXJobStatuses[0].id = randomAlteryxJob.id
        updatedAlteryxjob.alteryXJobStatuses[0].alteryXJobStatus = 'Completed'
  
        let response = await request.updateAlteryxjob(updatedAlteryxjob)
  
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsEtl.verifyPutAlteryxJobResponse(response)
    });
  });

  describe('POST AlteryX job #smoke', () => {
    it('232901 | Add alteryX Job to database with status and disposition', async () => {
        randomTransactionId = await request_matchedFiles.getRandomTransactionId()
        const newAlteryxjob = {}
        newAlteryxjob.transactionId = randomTransactionId
        newAlteryxjob.alteryXJobStatus = 'Completed'
        newAlteryxjob.alteryXJobDisposition = 'Error'
        
        let response = await request.postAlteryxjob(newAlteryxjob)

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
    });
  });
});