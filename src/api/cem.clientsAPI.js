const config = require('../../data/config');
const API = require('./API');

const clients = config.requests.CEM.clients

class ClientsAPI extends API{
    
    constructor(){
      super('ClientsAPI');
    }

    async getClients() {
      const response = await this.request_cem
                                    .get(clients)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cem + clients)
      this.validateSchema(response);
      return response;
    }

    async getClientsWithoutToken() {
      const response = await this.request_cem
                                    .get(clients)
      console.log(this.api_cem + clients)
      this.validateSchema(response);
      return response;
    }

    async getClientById(mdmClientId) {
      const response = await this.request_cem
                                    .get(clients + '/' + mdmClientId)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cem + clients + '/' + mdmClientId)
      this.validateSchema(response);
      return response;
    }

    async getClientByIdWithoutToken(mdmClientId) {
      const response = await this.request_cem
                                    .get(clients + '/' + mdmClientId)
      console.log(this.api_cem + clients + '/' + mdmClientId)
      this.validateSchema(response);
      return response;
    }

    async getRandomClientData() {
      let response = await this.getClients()
      let key = Object.keys(response.body.results)
      let num = Math.floor(Math.random() * (key.length-1))
      return response.body.results[num]
    }

    async getRandomClientId(randomClientData){
      if(null == randomClientData) {
        randomClientData = await this.getRandomClientData(await this.getClients());
      }
      return randomClientData.mdmClientId
    } 

    async getClientPermissions(mdmClientId) {
      let req = clients + '/' + mdmClientId + '/permissions'
      const response = await this.request_cem
                                    .get(req)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cem + req)
      this.validateSchema(response)
      return response
    }

    async getClientPermissionsWithoutToken(mdmClientId) {
      let req = clients + '/' + mdmClientId + '/permissions'
      const response = await this.request_cem
                                    .get(req)
      console.log(this.api_cem + req)
      this.validateSchema(response)
      return response
    }

    async getClientApplications(mdmClientId) {
      let req = clients + '/' + mdmClientId + '/applications'
      const response = await this.request_cem
                                    .get(req)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cem + req)
      this.validateSchema(response)
      return response
    }

    async getClientApplicationsWithoutToken(mdmClientId) {
      let req = clients + '/' + mdmClientId + '/applications'
      const response = await this.request_cem
                                    .get(req)
      console.log(this.api_cem + req)
      this.validateSchema(response)
      return response
    }
}

module.exports = ClientsAPI;