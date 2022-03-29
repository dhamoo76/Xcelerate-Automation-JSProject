const config = require('../../data/config')
const API = require('./API')

const applications = config.requests.ETL.applications

class ApplicationsAPI extends API {

    constructor() {
        super('ApplicationsAPI');
    }

    async getApplications() {
        const response = await this.request_etl.get(applications).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + applications)
        this.validateSchema(response)
        return response
    }

    async getRandomApplication() {
        let response = await this.getApplications()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let application = response.body.results[num]

        return application;
    }
}

module.exports = ApplicationsAPI;