const chai = require('chai')
const expect = chai.expect
const { proxy, flush } = require('@alfonso-presa/soft-assert')
const softExpect = proxy(expect)
const yargs = require('yargs').argv
const timestamp = Date.now()

chai.config.proxyExcludedKeys.push('catch')
exports.env = yargs.env ? yargs.env.toString() : "";

class Utilities {
    constructor() {}

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
      softExpect(_response.mdmMasterClientId, "MDM Master Client ID is not equal MDM Client ID: " + _response).to.be.equal(_response.mdmClientId)
      softExpect(_response.clientStatus, "Client status is wrong. Current value: " + _response.clientStatus).to.be.oneOf(['Active', 'Inactive'])
      flush()
    }

    verifyAllClientsFields(_response){
      for (const client of _response){
        this.verifyOneClientDataFields(client)
      }
    }

    /*** Legal Entities endpoint functions ***/

    verifyAllLegalEntitiesFields(_response, mdmMasterClientId){
      for (const legalEntity of _response){
        softExpect(legalEntity, "Legal Entity response not contains id: " + JSON.stringify(legalEntity)).to.have.property('id')
        softExpect(legalEntity, "Legal Entity response not contains name: " + JSON.stringify(legalEntity)).to.have.property('name')
        softExpect(legalEntity, "Legal Entity response not contains displayName: " + JSON.stringify(legalEntity)).to.have.property('displayName')
        softExpect(legalEntity, "Legal Entity response not contains entityType: " + JSON.stringify(legalEntity)).to.have.property('entityType')
        softExpect(legalEntity, "Legal Entity response not contains phone: " + JSON.stringify(legalEntity)).to.have.property('phone')
        softExpect(legalEntity, "Legal Entity response not contains email: " + JSON.stringify(legalEntity)).to.have.property('email')
        softExpect(legalEntity, "Legal Entity response not contains address1: " + JSON.stringify(legalEntity)).to.have.property('address1')
        softExpect(legalEntity, "Legal Entity response not contains address2: " + JSON.stringify(legalEntity)).to.have.property('address2')
        softExpect(legalEntity, "Legal Entity response not contains city: " + JSON.stringify(legalEntity)).to.have.property('city')
        softExpect(legalEntity, "Legal Entity response not contains country: " + JSON.stringify(legalEntity)).to.have.property('country')
        softExpect(legalEntity, "Legal Entity response not contains zip: " + JSON.stringify(legalEntity)).to.have.property('zip')
        softExpect(legalEntity, "Legal Entity response not contains state: " + JSON.stringify(legalEntity)).to.have.property('state')
        softExpect(legalEntity, "Legal Entity response not contains fiscalYear: " + JSON.stringify(legalEntity)).to.have.property('fiscalYear')
        softExpect(legalEntity, "Legal Entity response not contains identificationNumber: " + JSON.stringify(legalEntity)).to.have.property('identificationNumber')
        softExpect(legalEntity, "Legal Entity response not contains mdmMasterClientId: " + JSON.stringify(legalEntity)).to.have.property('mdmMasterClientId')
        softExpect(legalEntity, "Legal Entity response not contains firstName: " + JSON.stringify(legalEntity)).to.have.property('firstName')
        softExpect(legalEntity, "Legal Entity response not contains middleInitial: " + JSON.stringify(legalEntity)).to.have.property('middleInitial')
        softExpect(legalEntity, "Legal Entity response not contains lastName: " + JSON.stringify(legalEntity)).to.have.property('lastName')
        if(mdmMasterClientId){
          softExpect(legalEntity.mdmMasterClientId, "Legal Entity mdmMasterClientId is wrong: " + JSON.stringify(legalEntity)).to.be.eql(mdmMasterClientId)
        }
        flush()
      }
    }

    verifyOneLegalEntityData(_response, guid, displayName, name){
      if(guid){
        softExpect(_response.id, "Legal Entity id is wrong: " + JSON.stringify(_response)).to.be.eql(guid)
      }
      if(displayName){
        softExpect(_response.displayName, "Legal Entity displayName is wrong: " + JSON.stringify(_response)).to.be.eql(displayName)
      }
      if(name){
        softExpect(_response.name, "Legal Entity name is wrong: " + JSON.stringify(_response)).to.be.eql(name)
      }
      flush()
    }

    generatePostLegalEntitiesBody(mdmMasterClientId, middleInitial, entityTypesTable, addLegalEntityId){
      let body = {}
      body.callingUserId = 'autoUserId'

      let table = []
      for(let i = 0; i < entityTypesTable.length; i++) {
        if(addLegalEntityId){
          table[i] = {mdmMasterClientId: '', mdmLegalEntityId: '', name: '', firstName: '', middleInitial: '', lastName: '', entityType: ''}
        }
        else{
          table[i] = {mdmMasterClientId: '', name: '', firstName: '', middleInitial: '', lastName: '', entityType: ''}
        }
        table[i] = {mdmMasterClientId: '', name: '', firstName: '', middleInitial: '', lastName: '', entityType: ''}
        table[i].mdmMasterClientId = mdmMasterClientId + ''
        table[i].name = 'autoLegalEntity' + timestamp
        table[i].firstName = 'autoFirstName' + timestamp
        table[i].middleInitial = middleInitial
        table[i].lastName = 'autoLastName' + timestamp
        table[i].entityType = entityTypesTable[i]
        if(addLegalEntityId){
          table[i].mdmLegalEntityId = timestamp.toString().slice(6, 13)
        }
      }
      body.legalEntities = table

      return body
    }

    verifyPostLegalEntitiesResponse(response, countInserted, countUpdated, countRejected){
      softExpect(response.body, "Response not contains resultRows: " + JSON.stringify(response.body)).to.have.property('resultRows')
      softExpect(response.body.countInserted, "Response has wrong countInserted number: " + JSON.stringify(response.body)).to.be.eql(countInserted)
      softExpect(response.body.countUpdated, "Response has wrong countUpdated number: " + JSON.stringify(response.body)).to.be.eql(countUpdated)
      softExpect(response.body.countRejected, "Response has wrong countRejected number: " + JSON.stringify(response.body)).to.be.eql(countRejected)
      flush()
    }

    /*** Project Types endpoint functions ***/

    verifyAllProjectTypesFields(_response, typesTable){
      for (const projectType of _response){
        softExpect(projectType, "Project Type response not contains id: " + JSON.stringify(projectType)).to.have.property('id')
        softExpect(projectType, "Project Type response not contains name: " + JSON.stringify(projectType)).to.have.property('name')
        softExpect(projectType.name, "Project Type name has not predefined value: " + JSON.stringify(projectType)).to.be.oneOf(typesTable)
        softExpect(projectType, "Project Type response not contains description: " + JSON.stringify(projectType)).to.have.property('description')
        softExpect(projectType, "Project Type response not contains projectTypes table: " + JSON.stringify(projectType)).to.have.property('projectTypes')
        for (const type of projectType.projectTypes){
          softExpect(type, "Project Type not contains id: " + JSON.stringify(type)).to.have.property('id')
          softExpect(type, "Project Type not contains name: " + JSON.stringify(type)).to.have.property('name')
          softExpect(type, "Project Type not contains lineOfBusinessId: " + JSON.stringify(type)).to.have.property('lineOfBusinessId')
          softExpect(type.lineOfBusinessId, "Project Type not contains wrong lineOfBusinessId: " + JSON.stringify(type)).to.be.eql(projectType.id)
          softExpect(type, "Project Type not contains description: " + JSON.stringify(type)).to.have.property('description')
        }
        flush()
      }
    }
}

module.exports = Utilities;