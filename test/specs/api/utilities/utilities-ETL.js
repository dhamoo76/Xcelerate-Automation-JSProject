const chai = require('chai')
const expect = chai.expect
const { proxy, flush } = require('@alfonso-presa/soft-assert')
const softExpect = proxy(expect)
const yargs = require('yargs').argv

chai.config.proxyExcludedKeys.push('catch')
exports.env = yargs.env ? yargs.env.toString() : "";

class UtilitiesETL {
    constructor() {}

    /*** AlteryXJob endpoint functions ***/

    verifyAllAlteryxJobFields(_response){
      for (const alteryxjob of _response){
        softExpect(alteryxjob.id, "AlteryXJob id is empty: " + alteryxjob).not.to.be.null
        softExpect(alteryxjob.alteryXJobId, "alteryXJobId field is empty: " + alteryxjob).not.to.be.null
        softExpect(alteryxjob.transactionPath, "transactionPath field is empty: " + alteryxjob).not.to.be.null
        flush()
      }
    }

    verifyPutAlteryxJobResponse(response){
      softExpect(response.body, "Response not contains updatedEntities: " + response.body).to.have.property('updatedEntities')
      flush()
    }

    /*** AlteryxQuestions endpoint functions ***/

    verifyAllAlteryxQuestionsFields(_response){
      for (const alteryxQuestion of _response) {
        softExpect(alteryxQuestion.id, "AlteryX Question id is empty: " + JSON.stringify(alteryxQuestion)).not.to.be.null
        softExpect(alteryxQuestion.name, "AlteryX Question name is empty: " + JSON.stringify(alteryxQuestion)).not.to.be.null
        softExpect(alteryxQuestion.description, "AlteryX Question description is empty: " + JSON.stringify(alteryxQuestion)).not.to.be.null
        flush()
      }
    }

    /*** AlteryXWorkflows endpoint functions ***/

    verifyAllAlteryxWorkflowsFields(_response){
      for (const alteryxWorkflow of _response) {
        softExpect(alteryxWorkflow.id, "AlteryX Workflow id is empty: " + JSON.stringify(alteryxWorkflow)).not.to.be.null
        softExpect(alteryxWorkflow.name, "AlteryX Workflow name is empty: " + JSON.stringify(alteryxWorkflow)).not.to.be.null
        flush()
      }
    }

    verifyOneAlteryxWorkflow(response, expectedWorkflow){
      softExpect(response.body.results[0]).to.be.eql(expectedWorkflow)
      flush()
    }

    /*** Applications endpoint functions ***/

    verifyAllApplicationsFields(_response) {
      for (const application of _response) {
        softExpect(application.id, "Application id is empty: " + JSON.stringify(application)).not.to.be.null
        softExpect(application.name, "Application name is empty: " + JSON.stringify(application)).not.to.be.null
        softExpect(application.description, "Application description is empty: " + JSON.stringify(application)).not.to.be.null
        flush()
      }
    }

    /*** Files endpoint functions ***/

    verifyAllFilesFields(_response) {
      for (const file of _response) {
        softExpect(file.id, "File id is empty: " + JSON.stringify(file)).not.to.be.null
        softExpect(file.fileType, "File fileType is empty: " + JSON.stringify(file)).not.to.be.null
        softExpect(file.schemaType, "File schemaType is empty: " + JSON.stringify(file)).not.to.be.null
        flush()
      }
    }

    /*** MatchedFiles endpoint functions ***/

    verifyAllMatchedFilesFields(files) {
      for (const file of files) {
        softExpect(file.fileName, "fileName id is empty:" + file.fileName).not.to.be.null
        softExpect(file.transactionId, "transactionId is empty:" + file.transactionId).not.to.be.null
        softExpect(file.payloadId, "payloadId is empty:" + file.payloadId).not.to.be.null
        softExpect(file.payloadName, "payloadName is empty:" + file.payloadName).not.to.be.null
        softExpect(file.matchComplete, "matchComplete type is boolean:" + file.matchComplete).not.to.be.null
        softExpect(file.procedureId, "procedureId is empty:" + file.procedureId).not.to.be.null
        softExpect(file.procedureName, "procedureName is empty:" + file.procedureName).not.to.be.null
        softExpect(file.receivedDate, "receivedDate is empty:" + file.receivedDate).not.to.be.null
        softExpect(file.updatedDate, "updatedDate is empty:" + file.updatedDate).not.to.be.null
        softExpect(file.status, "status is empty:" + file.status).not.to.be.null
        flush()
      }
    }

    /*** PayloadDefinitions endpoint functions ***/

    verifyAllPayloadDefinitionsFields(_response, id, name, engagementId, projectId, referenceListId, protocolId, notificationRecipients, wf, ft) {

      for (const payload of _response) {
        softExpect(payload.id, "id is empty:" + payload.id).not.to.be.empty;
        if (null != id)
          softExpect(payload.id, "protocolId is :" + payload.id + "; Expected: " + id).to.be.equal(id);
  
        softExpect(payload.name, "name is empty:" + payload.name).not.to.be.empty;
        if (null != name)
          softExpect(payload.name, "name is :" + payload.name + "; Expected: " + name).to.be.equal(name);
  
        softExpect(payload.engagementId, "engagementId is empty:" + payload.engagementId).not.to.be.empty;
        if (null != engagementId)
          softExpect(payload.engagementId, "engagementId is :" + payload.engagementId + "; Expected: " + engagementId).to.be.equal(engagementId);
  
        softExpect(payload.projectId, "projectId is empty:" + payload.projectId).not.to.be.empty;
        if (null != projectId)
          softExpect(payload.projectId, "projectId is :" + payload.projectId + "; Expected: " + projectId).to.be.equal(projectId);
  
        softExpect(payload.referenceListId, "referenceListId is empty:" + payload.referenceListId).not.to.be.empty;
        if (null != referenceListId)
          softExpect(payload.referenceListId, "engagementId is :" + payload.referenceListId + "; Expected: " + referenceListId).to.be.equal(referenceListId);
  
        softExpect(payload.protocolId, "protocolId is empty:" + payload.protocolId).not.to.be.empty;
        if (null != protocolId)
          softExpect(payload.protocolId, "protocolId is :" + payload.protocolId + "; Expected: " + protocolId).to.be.equal(protocolId);
  
        softExpect(payload.notificationRecipients, "notificationRecipients is empty:" + payload.notificationRecipients).not.to.be.empty;
        if (null != notificationRecipients)
          softExpect(payload.notificationRecipients, "notificationRecipients is :" + payload.notificationRecipients + "; Expected: " + notificationRecipients).to.be.equal(notificationRecipients);
  
        //wf, ft  
        for (let i = 0; i++; i < payload.workflows.length) {
          softExpect(payload.workflows.id, " wf id is empty:" + payload.workflows.id).not.to.be.empty;
          if (null != wf[i].id)
            softExpect(payload.workflows[i].id, "protocolId is :" + payload.workflows.id + "; Expected: " + wf[i].id).to.be.equal(wf[i].id);
  
          softExpect(payload.workflows.name, " wf name is empty:" + payload.workflows.name).not.to.be.empty;
          if (null != wf[i].name)
            softExpect(payload.workflows[i].name, "wf name is :" + payload.workflows.name + "; Expected: " + wf[i].name).to.be.equal(wf[i].name);
        }
  
        for (let i = 0; i++; i < payload.fileTypes.length) {
          softExpect(payload.fileTypes.id, " fileTypes id is empty:" + payload.fileTypes.id).not.to.be.empty;
          if (null != ft[i].id)
            softExpect(payload.fileTypes[i].id, "ft is :" + payload.fileTypes.id + "; Expected: " + ft[i].id).to.be.equal(ft[i].id);
  
          softExpect(payload.fileTypes.name, " fileTypes name is empty:" + payload.fileTypes.name).not.to.be.empty;
          if (null != ft[i].name)
            softExpect(payload.fileTypes[i].name, "ft is :" + payload.fileTypes.name + "; Expected: " + ft[i].name).to.be.equal(ft[i].name);
  
          softExpect(payload.fileTypes.pattern, " fileTypes id is empty:" + payload.fileTypes.pattern).not.to.be.empty;
          if (null != ft[i].pattern)
            softExpect(payload.fileTypes[i].pattern, "pattern is :" + payload.fileTypes.patternd + "; Expected: " + ft[i].pattern).to.be.equal(ft[i].pattern);
        }
        flush()
      }
    };

    verifyPayloadDefinitionsPostAndPutResponse(response){
      softExpect(response.body.id, "Response not contains payload definition ID " + response.body).is.not.empty
      flush()
    }

    /*** Procedures endpoint functions ***/

    verifyAllProceduresFields(_response) {
        let count = 0

        for (const pr of _response) {
          softExpect(pr.id, "procedure id is empty:" + pr.id).not.to.be.null
          softExpect(pr.name, "procedure name is empty:" + pr.name).not.to.be.null
    
          softExpect(pr, "workflow not contains fileTypes table:" + pr.name).to.have.property('files')
          for(const ft of pr.files){
            softExpect(ft.id, "file fileType id is empty:" + ft).not.to.be.null
            softExpect(ft.schemaName, "file schemaName is empty:" + ft).not.to.be.null
            softExpect(ft.fileTypeName, "file fileTypeName is empty:" + ft).not.to.be.null
            flush()
          }
        
          if(pr.files.length == 0){
            count ++
          }
          flush()
        }
        if(count != 0) {
          console.log('Response contains ' + count + ' workflows with empty fileTypes table.')
        }
    }

    /*** Protocols endpoint functions ***/

    verifyAllProtocolsFields(_response, clientId, protocolName, protocolTypeId, protocolId) {

      for (const protocol of _response) {
  
  
        softExpect(protocol.id, "id is empty:" + protocol.id).to.not.be.null;
        if (null != protocolId)
          softExpect(protocol.id, "protocolId is :" + protocol.id + "; Expected: " + protocolId).to.be.equal(protocolId);
  
  
        softExpect(protocol.name, "name is empty:" + protocol.name).to.not.be.null;
  
        if (null != clientId)
          softExpect(protocol.mdmClientId, "mdmClientId is :" + protocol.mdmClientId + "; Expected: " + clientId).to.be.equal(clientId);
  
        softExpect(protocol.mdmClientId, "mdmClientId is empty:" + protocol.mdmClientId).to.not.be.null;
        softExpect(protocol.protocolTypeId, "protocolTypeId is empty:" + protocol.protocolTypeId).to.not.be.null;
  
        if (null != protocolTypeId)
          softExpect(protocol.protocolTypeId, "protocolTypeId is :" + protocol.protocolTypeId + "; Expected: " + protocolTypeId).to.be.equal(protocolTypeId);
  
        softExpect(protocol.protocolTypeName, "protocolTypeName is empty:" + protocol.protocolTypeName).to.not.be.null;
  
        if (null != protocolName){
          protocolName
          softExpect(decodeURI(protocol.protocolTypeName), "protocolTypeName is :" + protocol.protocolTypeName + "; Expected: " + protocolName).to.be.equal(decodeURI(protocolName));
        }
  
        softExpect(protocol.url, "url is empty:" + protocol.url).to.not.be.null;
        softExpect(protocol.folderPath, "folderPath is empty:" + protocol.folderPath).to.not.be.null;
        softExpect(protocol.userName, "userName is empty:" + protocol.userName).to.not.be.null;
        softExpect(protocol.password, "password is empty: " + protocol.password).to.not.be.null;
        softExpect(protocol.payloadDefinitionsCount, "payloadDefinitionsCount is empty: " + protocol.payloadDefinitionsCount).to.not.be.null;
        flush()
      }
    };

    verifyProtocolsPostAndPutResponse(response, expectedId){
      softExpect(response.body.id, "Response not contains protocol ID " + response.body).is.not.empty
      if(expectedId){
        expect(response.body.id, "Response contains wrong protocol ID: " + response.body.id).to.eql(expectedId)
      }
      flush()
    }

    /*** ProtocolTypes endpoint functions ***/

    verifyAllProtocolTypesFields(_response) {
      for (const protocolType of _response) {
        softExpect(protocolType.id, "protocolType id is empty:" + protocolType.id).not.to.be.null
        softExpect(protocolType.name, "protocolType name is empty:" + protocolType.name).not.to.be.null
        flush()
      }
    };

    /*** Deprecated or other functions ***/

    verifyPartialMatchesTable(response, randomPayload){
      if(randomPayload.procedures[0].files.length > 1){
        softExpect(response.body, "Response not contains completeMatches table: " + response.body).to.have.property('completeMatches')
        softExpect(response.body, "Response not contains partialMatches table: " + response.body).to.have.property('partialMatches')
        softExpect(response.body.partialMatches[0], "Partial matches table not contains procedureType: " + response.body).to.have.property('procedureType')
        softExpect(response.body.partialMatches[0].payloadDefinitionId, "payloadDefinitionId is not correct: " + response.body).to.be.equal(randomPayload.id)
        softExpect(response.body.partialMatches[0].procedureId, "procedureId is not correct: " + response.body).to.be.equal(randomPayload.procedures[0].id)
        flush()
      }
      else{
        softExpect(response.body, "Response not contains completeMatches table: " + response.body).to.have.property('completeMatches')
        softExpect(response.body, "Response not contains partialMatches table: " + response.body).to.have.property('partialMatches')
        softExpect(response.body.partialMatches, "Partial matches table is not empty: " + response.body).to.be.empty
        flush()
      }
    }

    generatePrepareUrisBody(payloadData){
      const preparedUrisBody = { protocolId: '', fileNames: ['']}
      preparedUrisBody.protocolId = payloadData.protocolId
      let count = 0

      for (const file of payloadData.procedures[0].files) {
        preparedUrisBody.fileNames[count] = file.pattern
        count++
      }

      return preparedUrisBody
    }

    verifyPrepareUrisResponse(_response, requestBody){
      let count = 0
      for (const uploadUrl of _response){
        softExpect(uploadUrl.fileName, "File Name in the response is different than in request body. File name in the response: " + uploadUrl.fileName + "File name sent in the body: " + requestBody.fileNames[count]).to.be.equal(requestBody.fileNames[count])
        softExpect(uploadUrl.uploadUrl, "Upload URL in the response is incorrect. Current URL: " + uploadUrl.uploadUrl).to.have.string("https://rsmxcelerateetl" + exports.env + '.blob.core.windows.net/' + requestBody.protocolId)
        count++
        flush()
      }
    }
}

module.exports = UtilitiesETL;