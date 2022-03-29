const config = require('../../data/config');
const API = require('./API');

const alterixWF = config.requests.ETL.alterixWF;
const alterixWFWithTop = alterixWF.concat(config.requests.ETL.withTop);
const alterixWFWithSkip = alterixWF.concat(config.requests.ETL.withSkip);

const alterixWFwithFilter = alterixWF.concat(config.requests.ETL.withFilter);
const byClient = config.requests.ETL.byClient;
const alterixWFWithFilterByClient = alterixWFwithFilter.concat(byClient);
const comma = config.requests.ETL.comma;

class AlterixWorkFlowAPI extends API {

    constructor() {
        super('AlterixWorkFlowAPI');
    }

    async getAllAlterixWorkFlows(clientId) { 
        const response = await this.request_etl.get(alterixWFWithFilterByClient.concat(clientId)).set('Authorization', 'Bearer ' + this.token)
        console.log(this.api_etl + alterixWFWithFilterByClient.concat(comma + clientId + comma));
        this.validateSchema(response);
        return response;
    }

    async getAllAlterixWorkFlowsWithSkip(num) {
        let req = alterixWFWithSkip + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getAllAlterixWorkFlowsWithTop(num) {
        let req = alterixWFWithTop + num;
        console.log(this.api_etl + req);
        const response = await this.request_etl.get(req).set('Authorization', 'Bearer ' + this.token)

        this.validateSchema(response);
        return response;
    }

    async getRandomAlterixWorkFlow(mdmClientId) {
        let responce = await this.getAllAlterixWorkFlows(mdmClientId);
        let key = Object.keys(responce.body.results);
        let num = Math.floor(Math.random() * (key.length - 1));
        let wf = responce.body.results[num];
        return wf;
    }

    async getRandomAlterixWorkFlowWithFileTypes(mdmClientId) {
        let response = await this.getAllAlterixWorkFlows(mdmClientId)
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

    async getAllAlteryxWorkFlowsWithoutToken() { 
        const response = await this.request_etl.get(alterixWF)
        console.log(this.api_etl + alterixWF)
        this.validateSchema(response)
        return response
    }

}

module.exports = AlterixWorkFlowAPI;