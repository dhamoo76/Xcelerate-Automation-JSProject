const config = require('../../data/config');
const API = require('./API');

const matchedFiles = config.requests.ETL.matchedFiles;
const matchedFilesWithTop = matchedFiles.concat(config.requests.ETL.withTop);
const matchedFilesWithSkip = matchedFiles.concat(config.requests.ETL.withSkip);

class MatchedFilesAPI extends API {

    constructor() {
        super('MatchedFilesAPI');
    }

    async getMatchedFiles() {
        const response = await this.request_etl.get(matchedFiles).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + matchedFiles);
        this.validateSchema(response);
        return response;
    }

    async getMatchedFilesWithSkip(num) {
        let req = matchedFilesWithSkip + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getMatchedFilesWithTop(num) {
        let req = matchedFilesWithTop + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getRandomTransactionId() {
        let response = await this.getMatchedFiles()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let transactionId = response.body.results[num].transactionId

        return transactionId
    }

}

module.exports = MatchedFilesAPI;