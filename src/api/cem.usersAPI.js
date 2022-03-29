const config = require('../../data/config')
const API = require('./API')

const users = config.requests.CEM.users

class UsersAPI extends API {

    constructor() {
        super('UsersAPI')
    }

    async getUsersByMdmClientId(mdmClientId) {
        const response = await this.request_cem.get(users + '?%24filter=mdmClientId%20in%20%28' + mdmClientId + '%29').set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cem + users + '?%24filter=mdmClientId%20in%20%28' + mdmClientId + '%29')
        this.validateSchema(response)
        return response
    }

    async getUsersByMdmClientIdWithoutToken(mdmClientId) {
        const response = await this.request_cem.get(users + '?%24filter=mdmClientId%20in%20%28' + mdmClientId + '%29')
        console.log(this.api_cem + users + '?%24filter=mdmClientId%20in%20%28' + mdmClientId + '%29')
        this.validateSchema(response)
        return response
    }

    async getRandomUserByMdmClientId(mdmClientId) {
        let response = await this.getUsersByMdmClientId(mdmClientId)
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let user = response.body.results[num]

        return user
    }

    async getRandomUserIdByMdmClientId(mdmClientId) {
        let response = await this.getUsersByMdmClientId(mdmClientId)
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let userId = response.body.results[num].id

        return userId
    }
}

module.exports = UsersAPI;