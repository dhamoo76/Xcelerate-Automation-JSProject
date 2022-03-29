const config = require('../../data/config')
const API = require('./API')

const prepareuris = config.requests.ETL.prepareuris

class DirectProcedureExecutionAPI extends API {

    constructor() {
        super('DirectProcedureExecutionAPI')
    }
    
    async putPrepareUris(body) {
        console.log(this.api_etl + prepareuris)
        const response = await this.request_etl.put(prepareuris).send(body).set('Authorization', 'Bearer ' + this.token)
        this.validateSchema(response)
        return response
    };
}

module.exports = DirectProcedureExecutionAPI;