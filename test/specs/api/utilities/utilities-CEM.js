const chai = require('chai')
const expect = chai.expect
const { proxy, flush } = require('@alfonso-presa/soft-assert')
const softExpect = proxy(expect)
const yargs = require('yargs').argv

chai.config.proxyExcludedKeys.push('catch')
exports.env = yargs.env ? yargs.env.toString() : "";

class Utilities {
    constructor() {}

    /*** Assignments endpoint functions ***/

    generateAssignmentsBody(roleIdsTable, userIdsTable, projectIdsTable, entityIdsTable, engagementIdsTable, clientIdsTable){
      let assignmentsBody = {}

      if(roleIdsTable != null) {
        assignmentsBody.roleIds =  []
        assignmentsBody.roleIds = roleIdsTable
      }

      if(userIdsTable != null) {
        assignmentsBody.userIds = []
        assignmentsBody.userIds = userIdsTable
      }

      if(projectIdsTable != null) {
        assignmentsBody.projectIds = []
        assignmentsBody.projectIds = projectIdsTable
      }

      if(entityIdsTable != null) {
        assignmentsBody.entityIds = []
        assignmentsBody.entityIds = entityIdsTable
      }

      if(engagementIdsTable != null) {
        assignmentsBody.engagementIds = []
        assignmentsBody.engagementIds = engagementIdsTable
      }

      if(clientIdsTable != null) {
        assignmentsBody.clientIds = []
        assignmentsBody.clientIds = clientIdsTable
      }

      return assignmentsBody
    }

    verifyIfAssignmentWasCreated(response){
      softExpect(response.body.id, "Assignment not created. Current response: " + response.body).not.to.be.null
      flush()
    }
    
    /*** Clients endpoint functions ***/

    verifyOneClientDataFields(_response, mdmClientId){
      if(mdmClientId){
        softExpect(_response.mdmClientId, "MDM Client ID is not correct. Current value: " + _response.mdmClientId + ', Expected: ' + mdmClientId).to.be.equal(mdmClientId)
      }
      else{
        softExpect(_response.mdmClientId, "MDM Client ID is empty: " + _response).not.to.be.null
      }
      softExpect(_response.mdmMasterClientId, "MDM Master Client ID is empty: " + _response).not.to.be.null
      softExpect(_response.name, "Client name is empty: " + _response).not.to.be.null
      flush()
    }

    verifyAllClientsFields(_response){
      for (const client of _response){
        this.verifyOneClientDataFields(client)
      }
    }

    verifyClientsApplicationsFields(_response){
      for (const application of _response){
        softExpect(application.id, "Application ID is empty: " + application).not.to.be.null
        softExpect(application.name, "Application name is empty: " + application).not.to.be.null
        softExpect(application, "Application description is not present in the response: " + application).to.have.property('description')
        softExpect(application, "Application roles is not present in the response: " + application).to.have.property('roles')
        flush()
      }
    }

    /*** Engagements endpoint functions ***/

    verifyAllfieldsEngagements = function (response, body) {
      softExpect(response.body.id, "EngagementID is not Empty " + response.body.id).not.to.be.empty
      softExpect(response.body.creatorId, "CreatorID is not Empty " + response.body.creatorId).not.to.be.empty
      softExpect(response.body.name, "'name' in the response is correct").to.be.equal(body.name)
      softExpect(response.body.description, "'description' in the response is correct").to.be.equal(body.description)
      softExpect(response.body.lineOfBusiness, "'lineOfBusiness' in the response is correct").to.be.equal(body.lineOfBusiness)
      softExpect(response.body.type, "'type' in the response is correct").to.be.equal(body.type)
      softExpect(response.body.status, "'status' in the response is correct").to.be.equal("Active")
      softExpect(response.body.sow, "'sow' in the response is correct").to.be.equal(body.sow)
      softExpect(response.body.mdmClientId, "'clientId' in the response is correct").to.be.equal(body.mdmClientId)
      flush()
    };
  
    verifyAllfieldsEngagementsForUpdate = function (response, body,status) {
      softExpect(response.body.id, "EngagementID is not Empty " + response.body.id).not.to.be.empty
      softExpect(response.body.creatorId, "CreatorID is not Empty " + response.body.creatorId).not.to.be.empty
      softExpect(response.body.name, "'name' in the response is correct").to.be.equal(body.name)
      softExpect(response.body.description, "'description' in the response is correct").to.be.equal(body.description)
      softExpect(response.body.lineOfBusiness, "'lineOfBusiness' in the response is correct").to.be.equal(body.lineOfBusiness)
      softExpect(response.body.type, "'type' in the response is correct").to.be.equal(body.type)
      softExpect(response.body.status, "'status' in the response is correct").to.be.equal(status)
      softExpect(response.body.sow, "'sow' in the response is correct").to.be.equal(body.sow)
      softExpect(response.body.mdmClientId, "'clientId' in the response is correct").to.be.equal(body.mdmClientId)
      flush()
    };

    /*** Projects endpoint functions ***/

    verifyAllfieldsProjectForGet = function (response) {
      softExpect(response.body.id, "ProjectID is not Empty " + response.body.id).not.to.be.empty
      softExpect(response.body.engagementId, "EngagementID is not Empty " + response.body.engagementId).not.to.be.empty
      softExpect(response.body.creatorId, "CreatorID is not Empty " + response.body.creatorId).not.to.be.empty
      softExpect(response.body.name, "'name' in the response is not Empty" + response.body.name).not.to.be.empty
      softExpect(response.body.status, "'status' in the response is not Empty" + response.body.status).not.to.be.empty
      flush()
    };
  
    verifyAllfieldsProjectForPost = function (response, body) {
      softExpect(response.body.id, "ProjectID is not Empty " + response.body.id).not.to.be.empty
      softExpect(response.body.engagementId, "EngagementID is Valid " + response.body.engagementId).to.be.equal(body.engagementId)
      softExpect(response.body.creatorId, "CreatorID is not Empty " + response.body.creatorId).not.to.be.empty
      softExpect(response.body.name, "'name' in the response is correct").to.be.equal(body.name)
      softExpect(response.body.description, "'description' in the response is correct").to.be.equal(body.description)
      softExpect(response.body.lineOfBusiness, "'lineOfBusiness' in the response is correct").to.be.equal(body.lineOfBusiness)
      softExpect(response.body.type, "'type' in the response is correct").to.be.equal(body.type)
      softExpect(response.body.status, "'status' in the response is correct").to.be.equal("Active")
      softExpect(response.body.mdmClientId, "'clientId' in the response is correct").to.be.equal(body.mdmClientId)
      flush()
    };
  
    verifyAllfieldsProjectForUpdate = function (response, body) {
      softExpect(response.body.id, "ProjectID is not Empty " + response.body.id).to.be.equal(body.id)
      softExpect(response.body.engagementId, "EngagementID is Valid " + response.body.engagementId).to.be.equal(body.engagementId)
      softExpect(response.body.creatorId, "CreatorID is not Empty " + response.body.creatorId).not.to.be.empty
      softExpect(response.body.name, "'name' in the response is correct").to.be.equal(body.name)
      softExpect(response.body.description, "'description' in the response is correct").to.be.equal(body.description)
      softExpect(response.body.lineOfBusiness, "'lineOfBusiness' in the response is correct").to.be.equal(body.lineOfBusiness)
      softExpect(response.body.type, "'type' in the response is correct").to.be.equal(body.type)
      softExpect(response.body.status, "'status' in the response is correct").to.be.equal(body.status)
      softExpect(response.body.mdmClientId, "'clientId' in the response is correct").to.be.equal(body.mdmClientId)
      flush()
    };

    generatePutLegalEntityToProjectBody(entityIdsTable){
      let projectsBody = {}

      if(entityIdsTable != null) {
        projectsBody.legalEntities = []
        projectsBody.legalEntities = entityIdsTable
      }

      return projectsBody
    }

    verifyAssignedEntitiesToProject(response, entityIdsTable){
      softExpect(response.body.assigned, "Assigned entity IDs are not correct. Assigned entities in the response: " + response.body.assigned).to.include.members(entityIdsTable)
      flush()
    }

    verifyUnassignedEntitiesFromProject(response, entityIdsTable){
      softExpect(response.body.unAssigned, "Unassigned entity IDs are not correct. Unassigned entities in the response: " + response.body.unAssigned).to.include.members(entityIdsTable)
      flush()
    }

    verifyLegalEntitiesForProjectFields(_response, legalEntityIds, projectId){
      for (const legalEntity of _response){
        softExpect(legalEntity.id, "Entity ID is not present in the response.").to.be.oneOf(legalEntityIds)
        softExpect(legalEntity, "name field is not present in the response.").to.have.property('name')
        softExpect(legalEntity, "mdmMasterClientId field is not present in the response.").to.have.property('mdmMasterClientId')
        softExpect(legalEntity, "mdmLegalEntityId field is not present in the response.").to.have.property('mdmLegalEntityId')
        softExpect(legalEntity, "entityType field is not present in the response.").to.have.property('entityType')
        softExpect(legalEntity, "phone field is not present in the response.").to.have.property('phone')
        softExpect(legalEntity, "email field is not present in the response.").to.have.property('email')
        softExpect(legalEntity, "address1 field is not present in the response.").to.have.property('address1')
        softExpect(legalEntity, "address2 field is not present in the response.").to.have.property('address2')
        softExpect(legalEntity, "city field is not present in the response.").to.have.property('city')
        softExpect(legalEntity, "country field is not present in the response.").to.have.property('country')
        softExpect(legalEntity, "zip field is not present in the response.").to.have.property('zip')
        softExpect(legalEntity, "state field is not present in the response.").to.have.property('state')
        softExpect(legalEntity, "fiscalYear field is not present in the response.").to.have.property('fiscalYear')
        softExpect(legalEntity, "identificationNumber field is not present in the response.").to.have.property('identificationNumber')
        softExpect(legalEntity, "firstName field is not present in the response.").to.have.property('firstName')
        softExpect(legalEntity, "middleInitial field is not present in the response.").to.have.property('middleInitial')
        softExpect(legalEntity, "lastName field is not present in the response.").to.have.property('lastName')
        softExpect(legalEntity, "projectIds field is not present in the response.").to.have.property('projects')
        let projectIds = []
        for (const project of legalEntity.projects){
          projectIds.push(project.id)
        }
        softExpect(projectIds, "Project IDs table do not include assigned project.").to.include(projectId)
        flush()
      }
    }

    /*** UIConfigurations endpoint functions ***/

    verifyUiConfigurationsFields(_response){
      softExpect(_response, "Response not contains engagementStatuses: " + _response).to.have.property('engagementStatuses')
      softExpect(_response, "Response not contains lineOfBusiness: " + _response).to.have.property('lineOfBusiness')
      softExpect(_response, "Response not contains engagementTypesWithGroups: " + _response).to.have.property('engagementTypesWithGroups')
      for (const engagementType of _response.engagementTypesWithGroups){
        softExpect(engagementType.name, "Engagement type name is empty: " + _response.engagementTypesWithGroups).not.to.be.null
        softExpect(engagementType.group, "Engagement type group is empty: " + _response.engagementTypesWithGroups).not.to.be.null
      }
      softExpect(_response, "Response not contains projectTypesWithGroups: " + _response).to.have.property('projectTypesWithGroups')
      for (const engagementType of _response.projectTypesWithGroups){
        softExpect(engagementType.name, "Project type name is empty: " + _response.projectTypesWithGroups).not.to.be.null
        softExpect(engagementType.group, "Project type group is empty: " + _response.projectTypesWithGroups).not.to.be.null
      }
      softExpect(_response, "Response not contains projectStatuses: " + _response).to.have.property('projectStatuses')
      flush()
    }
}

module.exports = Utilities;