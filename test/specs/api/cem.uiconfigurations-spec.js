const UIConfigurationsAPI = require('../../../src/api/cem.UIconfigurationsAPI')
const statusCode = require('../../../constants/status-code')
const Utilities = require('../api/utilities/utilities')
const UtilitiesCEM = require('../api/utilities/utilities-CEM')
let utils = new Utilities()
let utilsCem = new UtilitiesCEM()

describe('CEM - UiConfigurations endpoint smoke', () => {
    let request = new UIConfigurationsAPI();

  
    it('233041 | Get all uiConfigurations  #smoke', async () => {
      let response = await request.getUiConfigurations();
      utils.checkIfStatusCodeIsEqual(response, statusCode.OK)
      utilsCem.verifyUiConfigurationsFields(response.body)
    });

    it(' | Get all uiConfigurations without token  #smoke', async () => {
      let response = await request.getUiConfigurationsWithoutToken();
      utils.checkIfStatusCodeIsEqual(response, statusCode.UNAUTHORIZED)
    });


});
