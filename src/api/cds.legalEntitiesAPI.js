const config = require('../../data/config')
const API = require('./API')

const legalEntities = config.requests.CDS.legalEntities
const bulkinsert = config.requests.CDS.bulkinsert

const filter = config.requests.CDS.withFilter
const byGuid = config.requests.CDS.byGuid
const byMdmMasterClientId = config.requests.CDS.byMdmMasterClientId
const byName = config.requests.CDS.byName
const comma = config.requests.CDS.comma
const openBracket = config.requests.CDS.openBracket
const closeBracket = config.requests.CDS.closeBracket

class LegalEntitiesAPI extends API {

    constructor() {
        super('LegalEntitiesAPI')
    }

    async getAllLegalEntities(){
        let response = await this.request_cds
            .get(legalEntities)
            .set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cds + legalEntities)
        this.validateSchema(response)
        return response
    }

    async getRandomLegalEntity(){
        let response = await this.getAllLegalEntities()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let legalEntity = response.body.results[num]

        return legalEntity
    }

    async getLegalEntitiesByGuid(guid){
        let req = legalEntities + filter + byGuid + openBracket + guid + closeBracket
        let response = await this.request_cds.get(req).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cds + req)
        this.validateSchema(response)
        return response
    }

    async getLegalEntitiesByName(name){
        let req = legalEntities + filter + byName + openBracket + name + closeBracket
        let response = await this.request_cds.get(req).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cds + req)
        this.validateSchema(response)
        return response
    }

    async getLegalEntitiesByMdmMasterClientId(mdmMasterClientId){
        let req = legalEntities + filter + byMdmMasterClientId + openBracket + mdmMasterClientId + closeBracket
        let response = await this.request_cds.get(req).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cds + req)
        this.validateSchema(response)
        return response
    }

    async getAllLegalEntitiesWithoutToken(){
        let response = await this.request_cds.get(legalEntities)
        console.log(this.api_cds + legalEntities)
        this.validateSchema(response)
        return response
    }

    async postLegalEntities(body){
        console.log('POST request body: ' + JSON.stringify(body))
        let response = await this.request_cds
            .post(legalEntities + bulkinsert)
            .set('Authorization', 'Bearer ' + this.token)
            .send(body)
        console.log(this.api_cds + legalEntities)
        this.validateSchema(response)
        return response
    }

    async postLegalEntitiesWithoutToken(body){
        let response = await this.request_cds
            .post(legalEntities)
            .send(body)
        console.log(this.api_cds + legalEntities)
        this.validateSchema(response)
        return response
    }
}

module.exports = LegalEntitiesAPI