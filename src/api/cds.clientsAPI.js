const config = require('../../data/config')
const API = require('./API')

const clients = config.requests.CDS.clients
const filter = config.requests.CDS.withFilter
const byClient = config.requests.CDS.byMdmClientId
const openBracket = config.requests.CDS.openBracket
const closeBracket = config.requests.CDS.closeBracket

class ClientsAPI extends API{
    
    constructor(){
      super('ClientsAPI')
    }

    async getClients() {
      const response = await this.request_cds
                                    .get(clients)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cds + clients)
      this.validateSchema(response)
      return response
    }

    async getClientsByMdmClientId(mdmClientId) {
      let req = clients + filter + byClient + openBracket + mdmClientId + closeBracket
      const response = await this.request_cds
                                    .get(req)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cds + req)
      this.validateSchema(response)
      return response
    }

    async getClientById(mdmClientId) {
      const response = await this.request_cds
                                    .get(clients + '/' + mdmClientId)
                                    .set('Authorization', 'Bearer ' + this.token)
      console.log(this.api_cds + clients + '/' + mdmClientId)
      this.validateSchema(response)
      return response
    }

    async getRandomClientData() {
      let response = await this.getClients()
      let key = Object.keys(response.body.results)
      let num = Math.floor(Math.random() * (key.length-1))
      return response.body.results[num]
    }

    async getRandomClientId(randomClientData){
      if(null == randomClientData) {
        randomClientData = await this.getRandomClientData(await this.getClients())
      }
      return randomClientData.mdmClientId
    }

    async getRandomMasterClientId_7Digit(){
      let allClientsResponse = await this.getClients()
      let allClients = allClientsResponse.body.results

      let clientIds_7Digit = []
      for(const client of allClients){
        if(client.mdmMasterClientId / 1000000 >= 1 && client.mdmMasterClientId / 1000000 <= 10){
          clientIds_7Digit.push(client.mdmMasterClientId)
        }
      }
      
      let key = Object.keys(clientIds_7Digit)
      let num = Math.floor(Math.random() * (key.length-1))
      return clientIds_7Digit[num]
    }
}

module.exports = ClientsAPI