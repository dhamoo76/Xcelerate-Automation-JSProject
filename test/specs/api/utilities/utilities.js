const chai = require('chai')
const expect = chai.expect
const { proxy, flush } = require('@alfonso-presa/soft-assert')
const softExpect = proxy(expect)
const yargs = require('yargs').argv

chai.config.proxyExcludedKeys.push('catch')
exports.env = yargs.env ? yargs.env.toString() : "";

class Utilities {
    constructor() {}

    clearDataField(data, fieldName) {
      let modified = Object.assign({}, data)
      delete modified[fieldName]
      return modified
    }
  
    changeDataField(data, fieldName, newValue) {
      let modified = Object.assign({}, data)
      modified[fieldName] = newValue
      return modified
    }

    addElementToTable(table, newElement){
      if(newElement){
        table.push(newElement)
      }
    }
  
    checkIfStatusCodeIsEqual(response, statusCode) {
      expect(response.statusCode, "Response code isn't " + statusCode + ", Actual: " + response.statusCode).to.be.equal(statusCode)
    }

    checkIfStatusCodeIsNotEqual(response, statusCode) {
      expect(response.statusCode, "Response code is " + statusCode).not.to.be.equal(statusCode)
    }

    checkIfResponseResultsAreEmpty(response){
      expect(response.body.results, "Results are not empty " + response.body.results).to.be.empty;
    }

    checkIfResponseResultsAreNotEmpty(response){
      expect(response.body.results, "Results are empty ").not.to.be.empty;
    }

    checkSkippedValues(response, skipNumber){
      softExpect(response.body.skip, "Response not contains number of skipped values: " + response.body.skip).to.be.equal(skipNumber)
      flush()
    }

    checkTopValues(response, topNumber){
      softExpect(response.body.top, "Response not contains number of top values: " + response.body.top).to.be.equal(topNumber)
      flush()
    }

    checkValidationError(response, responseCode, errorMessage, validationField, validationMessage){
      expect(response.statusCode, "Response status code is: " + response.statusCode + "; Expected: " + responseCode).to.be.equal(responseCode)
      expect(response.body.error, "Response error is: " + response.body.error + "; Expected: " + errorMessage).to.be.equal(errorMessage)
      //TODO: update the method
      //expect(response.body.validations[validationField][0], "Validation message is: " + response.body.validations[validationField][0] + "; Expected: " + validationMessage).to.have.string(validationMessage)
    }
}

module.exports = Utilities;