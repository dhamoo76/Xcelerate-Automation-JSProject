const config = require('../../data/config')
const API = require('./API')

const userRoles = config.requests.CEM.userRoles

class UserRolesAPI extends API {

    constructor() {
        super('UserRolesAPI')
    }

    async getAllUserRoles() {
        const response = await this.request_cem.get(userRoles).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cem + userRoles)
        this.validateSchema(response)
        return response
    }

    async getAllUserRolesWithoutToken() {
        const response = await this.request_cem.get(userRoles)
        console.log(this.api_cem + userRoles)
        this.validateSchema(response)
        return response
    }

    async getRandomUserRole() {
        let response = await this.getAllUserRoles()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let userRole = response.body.results[num]
        return userRole
    }

    async getRandomUserRoleId() {
        let response = await this.getAllUserRoles()
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let userRoleId = response.body.results[num].id
        return userRoleId
    }
}

module.exports = UserRolesAPI;