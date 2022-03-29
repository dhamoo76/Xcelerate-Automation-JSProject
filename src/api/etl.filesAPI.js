const config = require('../../data/config')
const API = require('./API')

const files = config.requests.ETL.files

class FilesAPI extends API {

    constructor() {
        super('FilesAPI')
    }

    async getAllFiles() {
        const response = await this.request_etl.get(files).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + files)
        this.validateSchema(response)
        return response
    }

    async getAllFilesWithoutToken() {
        const response = await this.request_etl.get(files)
        console.log(this.api_etl + files)
        this.validateSchema(response)
        return response
    }

}

module.exports = FilesAPI;