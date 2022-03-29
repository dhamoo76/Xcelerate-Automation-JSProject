const config = require('../../data/config');
const API = require('./API');

const configuarations = config.requests.CEM.configuarations;

class UIconfigurationsAPI extends API {

  constructor() {
    super('UIconfigurationsAPI');
  }

  async getUiConfigurations() {
    const response = await this.request_cem
      .get(configuarations)
      .set('Authorization', 'Bearer ' + this.token)
    this.validateSchema(response);
    return response;
  }

  async getUiConfigurationsWithoutToken() {
    const response = await this.request_cem
      .get(configuarations)
    this.validateSchema(response);
    return response;
  }

  
  async getUiConfigurationsForEngagementsOnly() {
    const response = await this.getUiConfigurations();
    return response.body.engagementTypesWithGroups;
  }
  async getUiConfigurationsForProjectssOnly() {
    const response = await this.getUiConfigurations();
    return response.body.projectTypesWithGroups;
  }

}

module.exports = UIconfigurationsAPI;