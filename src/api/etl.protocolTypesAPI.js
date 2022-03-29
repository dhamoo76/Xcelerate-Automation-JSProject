const config = require('../../data/config');
const API = require('./API');

const protocolTypes = config.requests.ETL.protocolTypes;

class ProtocolTypesAPI extends API {

    constructor() {
        super('ProtocolTypesAPI');
    }

    async getAllProtocolTypes() {
        const response = await this.request_etl.get(protocolTypes).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + protocolTypes);
        this.validateSchema(response);
        return response;
    }

    //get first protocol type id
    async getRandomProtocolTypeId() {
        let type = await this.getRandomProtocolType()
        return type.id
    }

    async getRandomProtocolType() {
        let responce = await this.getAllProtocolTypes();
        
        let types = responce.body.results;
        for(let pt of types) {
            if(!pt.disabled){
                return pt;
            }
                
        }
    }

    async getProtocolNameById(id) {
        let allProtocols = await this.getAllProtocolTypes()
        let types = allProtocols.body.results;
        for (let protocol of types){
            if (protocol.id == id)
            return protocol.name;
        }
    }
    

}

module.exports = ProtocolTypesAPI;