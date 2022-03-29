const config = require('../../data/config')
const API = require('./API')

const projects = config.requests.CEM.projects

class ProjectsAPI extends API {

  constructor() {
    super('ProjectsAPI')
  }

  async getProjectsByMdmClientId(mdmClientId) {
    let req = projects + '?%24filter=mdmClientId%20eq%20%27' + mdmClientId + '%27'
    const response = await this.request_cem.get(req).set('Authorization', 'Bearer ' + this.token)
    console.log(this.api_cem + req)
    this.validateSchema(response)
    return response
  }

  async getRandomProject() {
    let response = await this.getProjects()
    let key = Object.keys(response.body.results)
    let num = Math.floor(Math.random() * (key.length - 1))
    let project = response.body.results[num]
    return project
  }

  async getRandomProjectForMdmClientId(mdmClientId) {
    let response = await this.getProjectsByMdmClientId(mdmClientId)
    let key = Object.keys(response.body.results)
    let num = Math.floor(Math.random() * (key.length - 1))
    let project = response.body.results[num]
    return project
  }

  async getRandomProjectIdForMdmClientId(mdmClientId) {
    let response = await this.getProjectsByMdmClientId(mdmClientId)
    let key = Object.keys(response.body.results)
    let num = Math.floor(Math.random() * (key.length - 1))
    let projectId = response.body.results[num].id
    return projectId
  }

  async postProjects(body) {
    const response = await this.request_cem
      .post(projects)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .send(body)
      .timeout(10000)
    this.validateSchema(response);
    console.log("Body : " + body)
    return response;
  };

  async postProjectsWithoutToken(body) {
    const response = await this.request_cem
      .post(projects)
      .set('Content-Type', 'application/json')
      .send(body)
      .timeout(10000)
    this.validateSchema(response);
    console.log("Body : " + body)
    return response;
  };

  async getProjects() {
    const response = await this.request_cem
      .get(projects)
      .set('Authorization', 'Bearer ' + this.token)
    console.log(this.api_cem + projects)
    this.validateSchema(response)
    return response
  }

  async getProjectsWithoutToken() {
    const response = await this.request_cem
      .get(projects)
    console.log(this.api_cem + projects)
    this.validateSchema(response)
    return response
  }

  async getProjectById(projectId) {
    const response = await this.request_cem
      .get(projects + '/' + projectId)
      .set('Authorization', 'Bearer ' + this.token)
    this.validateSchema(response);
    return response;
  }

  async getProjectByIdWithoutToken(projectId) {
    const response = await this.request_cem
      .get(projects + '/' + projectId)
    this.validateSchema(response);
    return response;
  }

  async updateProject(projectId, body) {
    const response = await this.request_cem
      .put(projects + '/' + projectId)
      .set('Authorization', 'Bearer ' + this.token)
      .set('Content-Type', 'application/json')
      .send(body)
    this.validateSchema(response);
    console.log("Body: " + JSON.stringify(body))
    console.log("ProjectID: " + projectId)
    return response;
  }

  async updateProjectWithoutToken(projectId, body) {
    const response = await this.request_cem
      .put(projects + '/' + projectId)
      .set('Content-Type', 'application/json')
      .send(body)
    this.validateSchema(response);
    console.log("Body : " + body)
    console.log("ProjectID : " + projectId)
    return response;
  }

  async getRandomProjectId() {
    let responce = await this.getProjects();
    let key = Object.keys(responce.body.results);
    let num = Math.floor(Math.random() * (key.length - 1));
    let projectId = responce.body.results[num].id;
    return projectId;
  }

  async getProjectMdmClientID(projectId){
      let project = await this.getProjectById(projectId);
      return project.body.mdmClientId
  }

  async getProjectEngagementID(projectId){
    let project = await this.getProjectById(projectId);
    return project.body.engagementId
  }

  async getRandomProjectName() {
    let responce = await this.getProjects();
    let key = Object.keys(responce.body.results);
    let num = Math.floor(Math.random() * (key.length - 1));
    let projectName = responce.body.results[num].name;
    return projectName;
  }

  async getProjectsInContextOfEngagement(engagementID) {
    let obj = []
    const response = await this.getProjects()

    for (let project in response.body.results)
      if (response.body.results[project].engagementId == engagementID) {
        obj.push(response.body.results[project].id)
      }

    return obj;
  }

  // # a method to find random Project ID in context of Engagement

  async getRandomProjectIDInContextOfEngagement(engagementID) {
    let obj = await this.getProjectsInContextOfEngagement(engagementID)
    let num = Math.floor(Math.random() * (obj.length - 1));
    let projectID = obj[num];
    console.log("Random project ID " + projectID + " in context of engagement : " + engagementID)
    return projectID;
  }

  // # a method to find random Project ID in context of Engagement not equal to defined Project ID
  async getNewProjectIDinContextOfEngagement(engagementID, projectID) {
    let newProjectID
    let obj = await this.getProjectsInContextOfEngagement(engagementID)
    for (const projectId of obj) {
      if (projectId != projectID) {
        newProjectID = projectId;
        break;
      }
    }
    return newProjectID;
  }

  async putLegalEntityIntoProject(projectId, body){
    const response = await this.request_cem
      .put(projects + '/' + projectId + '/legalEntity')
      .set('Authorization', 'Bearer ' + this.token)
      .set('Content-Type', 'application/json')
      .send(body)
    console.log("Body: " + JSON.stringify(body))
    console.log("ProjectID: " + projectId)
    this.validateSchema(response)
    return response
  }

  async getLegalEntitiesForProject(projectId){
    let req = projects + '/' + projectId + '/legalEntity'
    const response = await this.request_cem.get(req).set('Authorization', 'Bearer ' + this.token)
    
    console.log(this.api_cem + req)
    this.validateSchema(response)
    return response
  }
}

module.exports = ProjectsAPI;