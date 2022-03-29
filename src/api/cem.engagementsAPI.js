const config = require('../../data/config');
const API = require('./API');

const engagements = config.requests.CEM.engagements;

class EngagementsAPI extends API {

  constructor() {
    super('EngagementsAPI');
  }

  async postEngagements(body) {
    const response = await this.request_cem
      .post(engagements)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .send(body)
      .timeout(this.timeout)
    this.validateSchema(response);
    console.log ("Body : " + body)
    return response;
  };

  async postEngagementsWithoutToken(body) {
    const response = await this.request_cem
      .post(engagements)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .send(body)
      .timeout(this.timeout)
    this.validateSchema(response);
    console.log ("Body : " + body)
    return response;
  };

  async getEngagementsForOneCient(mdmClientID) {
    let obj = []

    const response = await this.request_cem
      .get(engagements)
      .set('Authorization', 'Bearer ' + this.token)
    this.validateSchema(response);

    for (let engagement in response.body.results)
      if (response.body.results[engagement].mdmClientId == mdmClientID && response.body.results[engagement].status =="Active") {
        obj.push(response.body.results[engagement].id)
      }
    return obj;
  }

  // # a method to find random Engagemnt ID in context of client

  async getRandomEngagementIDInContextOfClient(mdmClientID) {
    let obj = await this.getEngagementsForOneCient(mdmClientID)
    let num = Math.floor(Math.random() * (obj.length - 1));
    let engagementID = obj[num];
    console.log("Random Engagement ID " + engagementID + " in context of client : " + mdmClientID)
    return engagementID;
  }

  // # a method to find random Engagemnt ID in context of client not equal to defined engagement ID
  async getNewEngagementIDinContextOfClient(mdmClientID, engagementID) {
    let newEngagementID
    let obj = await this.getEngagementsForOneCient(mdmClientID)
    for (const engagementId of obj) {
      if (engagementId != engagementID ) {
        newEngagementID = engagementId;
        break;
      }
    }
    return newEngagementID;
  }

  async getEngagements() {
    const response = await this.request_cem
      .get(engagements)
      .set('Authorization', 'Bearer ' + this.token)
    this.validateSchema(response);
    return response;
  }

  async getEngagementsWithoutToken() {
    const response = await this.request_cem
      .get(engagements)
    this.validateSchema(response);
    return response;
  }

  async getEngagementsByMdmClientId(mdmClientId) {
    const response = await this.request_cem
      .get(engagements + '?%24filter=mdmClientId%20eq%20%27' + mdmClientId + '%27')
      .set('Authorization', 'Bearer ' + this.token)
    console.log(this.api_cem + engagements + '?%24filter=mdmClientId%20eq%20%27' + mdmClientId + '%27')
    this.validateSchema(response)
    return response
  }

  async getEngagementById(engagementId) {
    const response = await this.request_cem
      .get(engagements + '/' + engagementId)
      .set('Authorization', 'Bearer ' + this.token)
    this.validateSchema(response);
    return response;
  }

  async getEngagementByIdWithoutToken(engagementId) {
    const response = await this.request_cem
      .get(engagements + '/' + engagementId)
    this.validateSchema(response);
    return response;
  }

  async updateEngagement(engagementId, body) {
    const response = await this.request_cem
      .put(engagements + '/' + engagementId)
      .set('Authorization', 'Bearer ' + this.token)
      .set('Content-Type', 'application/json')
      .send(body)
    this.validateSchema(response);
    console.log ("Body : " + JSON.stringify(body))
    return response;
  }

  async updateEngagementWithoutToken(engagementId, body) {
    const response = await this.request_cem
      .put(engagements + '/' + engagementId)
      .set('Content-Type', 'application/json')
      .send(body)
    this.validateSchema(response);
    console.log ("Body : " + JSON.stringify(body))
    return response;
  }

  async getRandomEngagementId() {
    let responce = await this.getEngagements();
    let key = Object.keys(responce.body.results);
    let num = Math.floor(Math.random() * (key.length - 1));
    let engagementID = responce.body.results[num].id;
    return engagementID;
  }

  async getRandomEngagementIdForMdmClientId(mdmClientId) {
    let response = await this.getEngagementsByMdmClientId(mdmClientId)
    let key = Object.keys(response.body.results)
    let num = Math.floor(Math.random() * (key.length - 1))
    let engagementID = response.body.results[num].id
    return engagementID
  }

  // async getRandomEngagementId() {
  //   console.log(this.getRandomEngagement().id)
  //   return this.getRandomEngagement().id;
  // }
  async getEngagementIdWithDefinedStatus(status) {
    let engagementId
    let response = await this.getEngagements();
    let key = Object.keys(response.body.results);
    for (let i = 0; i < key.length - 1; i++) {
      const engagement = response.body.results[i];
      if (engagement.status == status) {
        engagementId = engagement.id
        console.log("Active Engagement ID : "+engagementId)
        break;
      }
    }
    return engagementId;
  }

  async getRandomEngagementName() {
    let responce = await this.getEngagements();
    let key = Object.keys(responce.body.results);
    let num = Math.floor(Math.random() * (key.length - 1));
    let engagementName = responce.body.results[num].name;
    return engagementName;
  }

  async getEngagementClientID(engagementId) {
    let responce = await this.getEngagementById(engagementId);
    let clientId = responce.body.mdmClientId;
    console.log("Client ID : " + clientId)
    return clientId;

  }

}

module.exports = EngagementsAPI;