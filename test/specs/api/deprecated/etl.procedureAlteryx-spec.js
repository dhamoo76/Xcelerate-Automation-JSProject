const expect = require('chai').expect;
const statusCode = require('../../../../constants/status-code')

const AlteryxjobAPI = require('../../../../src/api/etl.alteryxjobAPI')
const MatchedFilesAPI = require('../../../../src/api/etl.matchedFilesAPI')
const Utilities = require('../utilities/utilities')
let utils = new Utilities()

describe('/api/v1/procedures/alteryx verification', () => {

  //let request = new AlteryxjobAPI()
  //let request_matchedFiles = new MatchedFilesAPI()
  //let randomAlteryxJob

  describe('POST /procedures/alteryx jobs #smoke', () => {
    it('232899 | /api/v1/procedures/alteryx', async () => {
        let response = await request.getAlteryxjobs()

        utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
        utils.checkIfResponseResultsAreNotEmpty(response)
        utils.verifyAllAlteryxJobFields(response.body.results)
    });
  });

  
  
  /*Body of /procedures/alteryx
    {
    "name": "testnk,
    "applicationId": 0,
    "mdmClientId": 0,
    "alteryXWorkflowId": "0a042e73-283c-4444-4444-8e6f7f3fba78",
    "alteryXQuestionsToFiles": [
      {
        "alteryXQuestionId": "21310c2a-5fd6-477f-78eb-08d9881ec761",
        "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    ]
  }
  */
  async function generateMandatoryFieldsBody() {
    let body = {};

    let protocolType = await request_protocolTypes.getRandomProtocolType();
    body.protocolTypeId = protocolType.id;
    let properties = await protocolType.properties;
    let i = 0;
    while (null != properties[i]) {
      if (properties[i].required) {
        body[`${properties[i].name}`] = properties[i].name + '_' + timestamp;
      }
      i++
    }
    body.mdmClientId = await request_clients.getRandomClientId();
    body.name = "my protocol " + timestamp;
    console.log("body:" + JSON.stringify(body))

    return body;
  }
  
});