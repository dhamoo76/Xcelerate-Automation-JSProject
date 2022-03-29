const config = require('../../data/config');
const API = require('./API');

const protocols = config.requests.ETL.protocols;
const protocolWithFilter = protocols.concat(config.requests.ETL.withFilter);
const protocolWithFilterByClient = protocolWithFilter.concat(config.requests.ETL.byClient);
const protocolWithFilterByProtocolTypeName = protocolWithFilter.concat(config.requests.ETL.byProtocolTypeName);
const protocolWithFilterByProtocolTypeId = protocolWithFilter.concat(config.requests.ETL.byProtocolTypeId);
const comma = config.requests.ETL.comma;


class ProtocolsAPI extends API {

    constructor() {
        super('ProtocolsAPI');
    }

    async getProtocolsByProtocolId(protocolId) {
        const response = await this.request_etl.get(protocols + '/' + protocolId).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl.concat(protocols + '/' + protocolId));
        this.validateSchema(response);
        return response;
    };

    async getProtocolsByClientId(clientId) {
        const response = await this.request_etl.get(protocolWithFilterByClient.concat(comma + clientId + comma)).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl.concat(protocolWithFilterByClient.concat(comma + clientId + comma)));
        this.validateSchema(response);
        return response;
    };

    async getProtocolsByInvalidClientId(clientId) {
        const response = await this.request_etl.get(protocolWithFilterByClient.concat(clientId)).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl.concat(protocolWithFilterByClient.concat(clientId)));
        this.validateSchema(response);
        return response;
    };

    async getProtocolsByProtocolTypeName(protocolTypeName) {
        console.log(this.api_etl.concat(protocolWithFilterByProtocolTypeName.concat(comma + protocolTypeName + comma)));
        const response = await this.request_etl.get(protocolWithFilterByProtocolTypeName.concat(comma + protocolTypeName + comma)).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getProtocolsByProtocolTypeId(protocolTypeId) {
        console.log(this.api_etl.concat(protocolWithFilterByProtocolTypeId.concat(comma + protocolTypeId + comma)));
        const response = await this.request_etl.get(protocolWithFilterByProtocolTypeId.concat(comma + protocolTypeId + comma)).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getProtocolsByInvalidProtocolTypeId(protocolTypeId) {
        console.log(this.api_etl.concat(protocolWithFilterByProtocolTypeId.concat(protocolTypeId)));
        const response = await this.request_etl.get(protocolWithFilterByProtocolTypeId.concat(protocolTypeId)).set('Authorization', 'Bearer ' + this.token);
        this.validateSchema(response);
        return response;
    }

    async getProtocols() {
        const response = await this.request_etl.get(protocols).set('Authorization', 'Bearer ' + this.token);
        console.log(this.api_etl);
        this.validateSchema(response);
        return response;
    }

    async getRandomProtocol() {
        let responce = await this.getProtocols();
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        return responce.body.results[num];
    }

    async getRandomClientId() {
        let randomProtocolId = await this.getRandomProtocol();

        return randomProtocolId.mdmClientId;
    }

    async getAllprotocols() {
        let responce = await this.getProtocols();
        return responce.body.results;
    }

    async getRandomProtocolTypeName() {
        let randomProtocolId = await this.getRandomProtocol();
        let protocolTypeName = randomProtocolId.protocolTypeName
        protocolTypeName = (null == protocolTypeName) ? protocolTypeName : protocolTypeName.replace(' ', '%20')
        
        return protocolTypeName;
    }

    async getRandomProtocolTypeId() {
        let randomProtocolId = await this.getRandomProtocol();
        return randomProtocolId.protocolTypeId;
    }

    async getRandomProtocolId() {
        let randomProtocolId = await this.getRandomProtocol();
        return randomProtocolId.id;
    }

    async getRandomProtocolIdByClientId(clientId) {
        let responce = await this.getProtocolsByClientId(clientId);
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let protocolId = responce.body.results[num].id;
        return protocolId;
    }

    async getClientByProtocolId(protocolId) {
        let responce = await this.getProtocolsByProtocolId(protocolId);
        return responce.body.mdmClientId;
    }
    

    async postProtocols(body) {
        const response = await this.request_etl
                                      .post(protocols)
                                      .set('Authorization', 'Bearer ' + this.token)
                                      .send(body)
                                      .timeout(this.timeout);
        console.log("POST Protocol:" + JSON.stringify(body))
        this.validateSchema(response)
        return response;
    }

    async updateProtocol(body) {
        const response = await this.request_etl
                                      .put(protocols)
                                      .set('Authorization', 'Bearer ' + this.token)
                                      .send(body);
        console.log("PUT Protocol:" + JSON.stringify(body))
        this.validateSchema(response)
        return response
    }
}

module.exports = ProtocolsAPI;