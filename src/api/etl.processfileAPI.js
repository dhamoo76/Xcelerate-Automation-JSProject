const config = require('../../data/config');
const API = require('./API');

const processFile = config.requests.ETL.processFile;

class ProcessfileAPI extends API {

    constructor() {
        super('ProcessFileAPI');
    }

    async postProcessFile(protocolId, fileName, fileLocation) {

        let query = {
            "protocolId": `${protocolId}`,//3fa85f64-5717-4562-b3fc-2c963f66afa6
            "fileName": `${fileName}`, //"000.00
            "fileLocation": `${fileLocation}` //1234
        };

        console.log(JSON.stringify(query));
        console.log(this.api_etl + processFile);
        const response = await this.request_etl.post(processFile).send(query).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    };
}

module.exports = ProcessfileAPI;