const timestamp = Date.now()
const invalidData = require('../data/config').invalidData

module.exports = {
  regression: {
    correctParameters: {
      "name": "payload definition auto " + timestamp,
      "engagementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", //todo: update when it is ready from CEM
      "projectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",  //todo: update when it is ready from CEM
      "referenceListId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",  //todo: update when it is ready from CEM
      "protocolId": "",
      "notificationRecipients": "auto@ex.com",
      "mdmClientId": 0,
      "procedures": [{
        "id": "",
        "filePatterns": [
          {
            "fileId": "",
            "pattern": ""
          }
        ]
      }
      ]
    },
    fieldsNull: {
      "name": null,
      "engagementId": null,
      "projectId": null,  
      "referenceListId": null,  
      "protocolId": null,
      "notificationRecipients": null,
      "mdmClientId": null,
      "procedures": [{
        "id": null,
        "filePatterns": [
          {
            "fileId": null,
            "pattern": null
          }
        ]
      }
      ]
    },
    invalid: {
      "name": invalidData.notExistingProtocolId,
      "engagementId": invalidData.notExistingProtocolId,
      "projectId": invalidData.notExistingProtocolId,  
      "referenceListId": invalidData.notExistingProtocolId,  
      "protocolId": invalidData.notExistingProtocolId,
      "notificationRecipients": null,
      "mdmClientId": null,
      "procedures": [{
        "id": invalidData.notExistingProtocolId,
        "filePatterns": [
          {
            "fileId": invalidData.notExistingProtocolId,
            "pattern": invalidData.notExistingProtocolId
          }
        ]
      }
      ]
    },
    longValues: {
      "name": invalidData.longValue,
      "engagementId": invalidData.longValue,
      "projectId": invalidData.longValue,  
      "referenceListId": invalidData.longValue,  
      "protocolId": invalidData.longValue,
      "notificationRecipients": invalidData.longValue,
      "mdmClientId": 0,
      "procedures": [{
        "id": invalidData.longValue,
        "filePatterns": [
          {
            "fileId": invalidData.longValue,
            "pattern":invalidData.longValue
          }
        ]
      }
      ]
    }
  }
}