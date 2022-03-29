const config = require('../../data/config')
const API = require('./API')

const assignments = config.requests.CEM.assignments

class AssignmentsAPI extends API {

    constructor() {
        super('AssignmentsAPI')
    }

    async getAssignments(mdmClientId) {
        const response = await this.request_cem.get(assignments + '/' + mdmClientId).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_cem + assignments)
        this.validateSchema(response)
        return response
    }

    async getAssignmentsWithoutToken(mdmClientId) {
        const response = await this.request_cem.get(assignments + '/' + mdmClientId)
        console.log(this.api_cem + assignments)
        this.validateSchema(response)
        return response
    }

    async getRandomAssignment(mdmClientId) {
        let response = await this.getAssignments(mdmClientId)
        let key = Object.keys(response.body.results)
        let num = Math.floor(Math.random() * (key.length - 1))
        let assignment = response.body.results[num]

        return assignment
    }

    async postAssignments(body){
        let response = await this.request_cem
            .post(assignments)
            .set('Authorization', 'Bearer ' + this.token)
            .send(body)
        this.validateSchema(response)
        return response
    }

    async postAssignmentsWithoutToken(body){
        let response = await this.request_cem
            .post(assignments)
            .send(body)
        this.validateSchema(response)
        return response
    }

    async deleteAssignments(assignmentIdsTable){
        let req = assignments + '?'

        for(const id of assignmentIdsTable){
            req += 'Ids=' + id + '&'
        }

        console.log(this.api_cem + req)
        let response = await this.request_cem
            .delete(req)
            .set('Authorization', 'Bearer ' + this.token)
        this.validateSchema(response)
        return response
    }
}

module.exports = AssignmentsAPI;