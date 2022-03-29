const statusCode = require('../../../constants/status-code')
const data = require('../../../data/cds.projectTypes')
const ProjectTypesAPI = require('../../../src/api/cds.projectTypesAPI')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCDS = require('../api/utilities/utilities-CDS')
let utils = new Utilities()
let utilsCds = new UtilitiesCDS()

  describe('CDS - /projectTypes endpoint verification', () => {
    let request = new ProjectTypesAPI()

    describe('CDS - /projectTypes GET', () => {
      it('225328, 225330 | Check the call returns the project types | Check that LOB table is added and contains needed columns AND predefined values #smoke', async () => {
        let response = await request.getProjectTypes()
    
        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utilsCds.verifyAllProjectTypesFields(response.body.results, data.projectTypes)
      });

      it('267902 | Check non authorized request', async () => {
        let response = await request.getProjectTypesWithoutToken()
        
        utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
      });
    });
});