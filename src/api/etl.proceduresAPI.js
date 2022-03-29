const config = require('../../data/config');
const API = require('./API');

const procedures = config.requests.ETL.procedures;

const procedureswithFilter = procedures.concat(config.requests.ETL.withFilter);
const byClient = config.requests.ETL.byClient;
const byAppId = config.requests.ETL.byAppId;
const proceduresWithFilterByClient = procedureswithFilter.concat(byClient);
const proceduresWithFilterByAppId = procedureswithFilter.concat(byAppId);
const comma = config.requests.ETL.comma;

class ProceduresAPI extends API {

    constructor() {
        super('ProceduresAPI');
    }

    async getAllProcedures(clientId) { 
        const response = await this.request_etl.get(proceduresWithFilterByClient.concat(comma + clientId + comma)).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + proceduresWithFilterByClient.concat(comma + clientId + comma));
        this.validateSchema(response);
        return response;
    }

    async getAllProceduresByApplicationId(applicationId) { 
        const response = await this.request_etl.get(proceduresWithFilterByAppId.concat( comma + applicationId + comma)).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + proceduresWithFilterByAppId.concat(comma + applicationId + comma));
        this.validateSchema(response);
        return response;
    }

    async getAllProceduresWithoutArgs() { 
        const response = await this.request_etl.get(procedures).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + procedures);
        this.validateSchema(response);
        return response;
    }

    async getAllProceduresWithSkip(num) {
        let req = proceduresWithSkip + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getAllProceduresWithTop(num) {
        let req = proceduresWithTop + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getRandomProcedures(mdmClientId) {
        let responce = await this.getAllProcedures(mdmClientId);
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let wf = responce.body.results[num];
        return wf;
    }

    async getRandomProceduresWithFileTypes(mdmClientId) {
        let response = await this.getAllProcedures(mdmClientId)
        let workflowsTable = []
        let count = 0

        // save all workflows with file types into workflowsTable
        for (const workflow of response.body.results) {
            if(workflow.files.length != 0){
                workflowsTable[count] = workflow
                count ++
            }
        }

        let key = Object.keys(workflowsTable)
        let num = Math.floor(Math.random() * (key.length - 1))
        let wf = workflowsTable[num]
        return wf
    }

    async getProcedureWithFileTypesAndClientId(listOfClients) {
        let prTable = []
        let count = 0
        let obj = {}
       
        for (let client of listOfClients.body.results){
            let allProceduresBody = await this.getAllProcedures(client.mdmClientId);
            let allProcedures = allProceduresBody.body.results;
           
            for (let pr of allProcedures){
                if(pr.files.length != 0){
                    obj.mdmclientId = client.mdmClientId;
                    obj.procedure = {}
                    obj.procedure.id = pr.id;
                    obj.procedure.files = pr.files;
                    return obj;
                }
            }
        }
    }

}

module.exports = ProceduresAPI;