const config = require('../../data/config')
const API = require('./API')

const projectTypes = config.requests.CDS.projectTypes

class ProjectTypesAPI extends API{
    
    constructor(){
      super('ProjectTypesAPI')
    }

    async getProjectTypes() {
      const response = await this.request_cds
                                    .get(projectTypes)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cds + projectTypes)
      this.validateSchema(response)
      return response
    }

    async getProjectTypesWithoutToken() {
      const response = await this.request_cds.get(projectTypes)
      console.log(this.api_cds + projectTypes)
      this.validateSchema(response)
      return response
    }
}

module.exports = ProjectTypesAPI