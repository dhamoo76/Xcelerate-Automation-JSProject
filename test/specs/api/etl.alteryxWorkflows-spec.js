const statusCode = require('../../../constants/status-code')

const AlteryxWorkflowsAPI = require('../../../src/api/etl.alterixWorkFlowAPI');
const Utilities = require('../api/utilities/utilities')
const UtilitiesETL = require('../api/utilities/utilities-ETL')
let utils = new Utilities()
let utilsEtl = new UtilitiesETL()

describe('/alteryxworkflows verification', () => {

  let request = new AlteryxWorkflowsAPI();
  let responseLength
  let firstWorkflow
  let lastWorkflow


  //note: they will be remoed and new API calls will be avaialble 

  describe('209793, 240046 | Get all workflows #smoke', () => {
    it('All workflows (without filtering)', async () => {
      let response = await request.getAllAlterixWorkFlows()
      firstWorkflow = response.body.results[0]
      responseLength = response.body.results.length
      lastWorkflow = response.body.results[responseLength - 1]

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyAllAlteryxWorkflowsFields(response.body.results)
    });

    it('All workflows - unauthorized request', async () => {
      let response = await request.getAllAlteryxWorkFlowsWithoutToken()

      utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
    });
  });

  describe('209794 | Workflows with skip #smoke', () => {
    it('Workflows with skip filter - get last workflow)', async () => {
      let response = await request.getAllAlterixWorkFlowsWithSkip(responseLength - 1)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyOneAlteryxWorkflow(response, lastWorkflow)
      utils.checkSkippedValues(response, responseLength - 1)
      utilsEtl.verifyAllAlteryxWorkflowsFields(response.body.results)
    });
  });

  describe('209794 | Workflows with top #smoke', () => {
    it('Workflows with top filter - get first workflow)', async () => {
      let response = await request.getAllAlterixWorkFlowsWithTop(1)

      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsEtl.verifyOneAlteryxWorkflow(response, firstWorkflow)
      utils.checkTopValues(response, 1)
      utilsEtl.verifyAllAlteryxWorkflowsFields(response.body.results)
    });
  });
});