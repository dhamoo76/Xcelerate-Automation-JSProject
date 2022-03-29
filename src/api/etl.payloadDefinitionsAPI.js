const config = require('../../data/config');
const API = require('./API');

const payloadDefinitions = config.requests.ETL.payloadDefinitions;
const payloadDefinitionsWithFilter = payloadDefinitions.concat(config.requests.ETL.withFilter);
const byClient = config.requests.ETL.byClient;
const payloadDefinitionsWithFilterByClient = payloadDefinitionsWithFilter.concat(byClient);
const byProtocolId = config.requests.ETL.byProtocolTypeId;
const comma = config.requests.ETL.comma;

class PayloadDefinitionsAPI extends API {

    constructor() {
        super('PayloadDefinitionsAPI');
    }

    async getPayloadDefinitionsByClientId(clientId) {
        const response = await this.request_etl.get(payloadDefinitionsWithFilterByClient.concat(comma + clientId + comma)).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl.concat(payloadDefinitionsWithFilterByClient.concat(clientId)));
        this.validateSchema(response);
        return response;
    };

    async getPayloadDefinitionsByInvalildClientId(clientId) {
        const response = await this.request_etl.get(payloadDefinitionsWithFilterByClient.concat(clientId)).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl.concat(payloadDefinitionsWithFilterByClient.concat(clientId)));
        this.validateSchema(response);
        return response;
    };

    async getPayloadsByProtAndClientId(validProtocolTypeId, validClientId) {
        let fullrequest = payloadDefinitionsWithFilter + byProtocolId + comma + validProtocolTypeId +comma +  '%20and%20' + byClient + comma + validClientId + comma;
        console.log(this.api_etl.concat(fullrequest));

        const response = await this.request_etl.get(fullrequest).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getPayloadsByClientAndProtId(validClientId, validProtocolTypeId) {
        let fullrequest = payloadDefinitionsWithFilterByClient + comma + validClientId + comma + '%20and%20' + byProtocolId + comma + validProtocolTypeId + comma;
        console.log(this.api_etl.concat(fullrequest));

        const response = await this.request_etl.get(fullrequest).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getPayloadsByInvalidClientAndProtId(validClientId, validProtocolTypeId) {
        let fullrequest = payloadDefinitionsWithFilterByClient + validClientId + '%20and%20' + byProtocolId + validProtocolTypeId;
        console.log(this.api_etl.concat(fullrequest));

        const response = await this.request_etl.get(fullrequest).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getPayloadDefinitions() {
        const response = await this.request_etl.get(payloadDefinitions).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl + payloadDefinitions);
        this.validateSchema(response);
        return response;
    }

    async getPayloadDefinitionsById(id) {
        const response = await this.request_etl.get(payloadDefinitions + '/' + id).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl + payloadDefinitions + '/' + id);
        this.validateSchema(response);
        return response;
    }

    async getRandomClientId() {
        let responce = await this.getPayloadDefinitions();

        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));

        let clientId = responce.body.results[num].clientId;

        return clientId;
    }

    async getAllPayloadDefinitions() {
        let responce = await this.getPayloadDefinitions();
        return responce.body.results;
    }

    async getRandomProtocolTypeName() {
        let responce = await this.getPayloadDefinitions();
        let key = await Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let protocolTypeName = responce.body.results[num].protocolTypeName;

        return protocolTypeName;
    }

    async getRandomProtocolTypeId() {
        let responce = await this.getPayloadDefinitions();
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let protocolTypeId = responce.body.results[num].protocolTypeId;

        return protocolTypeId;
    }

    async getRandomProtocolProtocolTypeId() {
        let responce = await this.getPayloadDefinitions();
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let protocolTypeId = responce.body.results[num].protocolTypeId;
        let protocolId = responce.body.results[num].protocolId;

        let result = { protocolTypeId: protocolTypeId, protocolId: protocolId };
        return result;
    }

    async getRandomProtocolId() {
        let responce = await this.getPayloadDefinitions();
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let protocolId = responce.body.results[num].protocolId;

        return protocolId;
    }

    async addPayload(body) {
        const response = await this.request_etl.put(payloadDefinitions).set('Authorization', 'Bearer ' + this.token).send(body);
        console.log(this.api_etl + payloadDefinitions);
        console.log(body);
        this.validateSchema(response);
        return response;
    }

    async getRandomPayloadDefinition() {
        let responce = await this.getPayloadDefinitions()
        let key = Object.keys(responce.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let payloadDefinition = responce.body.results[num]

        return payloadDefinition
    }

    async getRandomPayloadDefinitionWithFiles() {
        let responce = await this.getPayloadDefinitions()
        console.log(JSON.stringify(responce.body.results[0]))
        for(let pd of responce.body.results){
            let key = Object.keys(pd.procedures[0].files);
            if (key.length !=0 ){
                return pd;
            }
        }
    }
    
    async getRandomPayloadDefinitionWithProcedures() {
        let response = await this.getAllPayloadDefinitions()
        let payloadsTable = []
        let count = 0

        // save all payload definitions with procedures into payloadsTable
        for (const payload of response) {
            if(payload.procedures.length != 0 && count < 5){
                payloadsTable[count] = payload
                count ++
            }
        }

        let key = Object.keys(payloadsTable)
        let num = Math.floor(Math.random() * (key.length - 1))
        let randomPayload = payloadsTable[num]
        return randomPayload
    }

    async getRandomPayloadDefinitionId() {
        let responce = await this.getPayloadDefinitions();
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let payloadDefinitionId = responce.body.results[num].id;

        return payloadDefinitionId;
    }


    async postPayloadDefinitions(payloadDefinitionsBody){
        console.log('post PD body: ' + JSON.stringify(payloadDefinitionsBody))
        const response = await this.request_etl
                                      .post(payloadDefinitions)
                                      .set('Authorization', 'Bearer ' + this.token)
                                      .send(payloadDefinitionsBody)
        this.validateSchema(response)
        return response;
    }

    async putPayloadDefinitions(payloadDefinitionsBody){
        console.log('put PD body: ' + JSON.stringify(payloadDefinitionsBody))
        const response = await this.request_etl
                                      .put(payloadDefinitions)
                                      .set('Authorization', 'Bearer ' + this.token)
                                      .send(payloadDefinitionsBody)
        this.validateSchema(response)
        return response;
    }
}

module.exports = PayloadDefinitionsAPI;