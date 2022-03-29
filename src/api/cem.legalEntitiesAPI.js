const config = require('../../data/config')
const API = require('./API')

const legalEntities = config.requests.CEM.legalEntities

class LegalEntitiesAPI extends API {

    constructor() {
        super('LegalEntitiesAPI')
    }

    async getAllLegalEntities() {
        const response = await this.request_cem.get(legalEntities).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cem + legalEntities)
        this.validateSchema(response)
        return response
    }

    async getLegalEntitiesForOneClient(mdmMasterClientId) {
        let req = legalEntities + '?%24filter=mdmMasterClientId%20eq%20%27' + mdmMasterClientId + '%27'
        const response = await this.request_cem.get(req).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cem + req)
        this.validateSchema(response)
        console.log('Client ' + mdmMasterClientId + ' has ' + response.body.results.length + ' legal entities assigned')
        return response
    }
    
    async getAllLegalEntitiesWithoutToken() {
        const response = await this.request_cem.get(legalEntities)
        console.log(this.api_cem + legalEntities)
        this.validateSchema(response)
        return response
    }

    async getRandomLegalEntity() {
        let response = await this.getAllLegalEntities()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let entity = response.body.results[num]
        return entity
    }

    async getRandomLegalEntityId() {
        let response = await this.getAllLegalEntities()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let entityId = response.body.results[num].id
        return entityId
    }

    async getRandomLegalEntityMdmClientId() {
        let response = await this.getAllLegalEntities()
        let responseLength = response.body.results.length
        if(responseLength > 0){
            let key = Object.keys(response.body.results)
            let num = Math.floor(Math.random() * (key.length - 1))
            let entityMdmClientId = response.body.results[num].mdmMasterClientId
            return entityMdmClientId
        }
        else{
            console.log('There are no entities available!')
            return 0
        }
    }
}

module.exports = LegalEntitiesAPI;