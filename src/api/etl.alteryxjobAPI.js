const config = require('../../data/config')
const API = require('./API')

const alteryxjob = config.requests.ETL.alteryxjob

class AlteryxjobAPI extends API {

    constructor() {
        super('AlteryxjobAPI');
    }

    async getAlteryxjobs() {
        const response = await this.request_etl.get(alteryxjob).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + alteryxjob)
        this.validateSchema(response)
        return response
    }

    async postAlteryxjob(body){
        const response = await this.request_etl
                                    .post(alteryxjob)
                                    .set('Authorization', 'Bearer ' + this.token)
                                    .send(body)
        console.log("AlteryxJob POST body:" + JSON.stringify(body))
        this.validateSchema(response)
        return response
    }

    async updateAlteryxjob(body){
        const response = await this.request_etl
                                    .put(alteryxjob)
                                    .set('Authorization', 'Bearer ' + this.token)
                                    .send(body)
        this.validateSchema(response)
        console.log("AlteryxJob PUT body:" + JSON.stringify(body))
        return response
    }

    async getRandomAlteryxjob() {
        let response = await this.getAlteryxjobs()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let alteryxjob = response.body.results[num]

        return alteryxjob
    }
}

module.exports = AlteryxjobAPI;