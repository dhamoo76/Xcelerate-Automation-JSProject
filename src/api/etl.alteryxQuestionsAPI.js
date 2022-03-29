const { QUESTIONNAIRE } = require('@wdio/cli/build/constants')
const config = require('../../data/config')
const API = require('./API')
const alteryxQuestions = config.requests.ETL.alteryxQuestions

class AlteryxQuestionsAPI extends API {

    constructor() {
        super('AlteryxQuestionsAPI')
    }

    async getAllAlteryxQuestions() { 
        const response = await this.request_etl.get(alteryxQuestions).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + alteryxQuestions)
        this.validateSchema(response)
        return response
    }

    async getRandomAlteryxQuestion() {
        let response = await this.getAllAlteryxQuestions()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let alteryxQuestion = response.body.results[num]
        return alteryxQuestion
    }

    async getAllAlteryxQuestionsWithoutToken() { 
        const response = await this.request_etl.get(alteryxQuestions)
        console.log(this.api_etl + alteryxQuestions)
        this.validateSchema(response)
        return response
    }
}

module.exports = AlteryxQuestionsAPI;