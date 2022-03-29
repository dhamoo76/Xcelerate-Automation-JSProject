const config = require('../../data/config');
const supertest = require ('supertest');
const tv4 = require('tv4');
const schema = require('./schema.json');

class API {
    constructor(endpointName) {
        this.api_etl = config.envs.ETL.api;
        this.request_etl = supertest(this.api_etl);

        this.api_cem = config.envs.CEM.api;
        this.request_cem = supertest(this.api_cem);

        this.api_cds = config.envs.CDS.api;
        this.request_cds = supertest(this.api_cds);

        this.token = config.envs.token;
        this.timeout = config.envs.timeout;
    }

    async validateSchema (data) {
        let result = tv4.validateResult(data, schema);//'https://dev-xcelerateetl.api.rsmus.com/swagger/v1/swagger.json');
    
        return result.valid; 
    }
}

module.exports = API;