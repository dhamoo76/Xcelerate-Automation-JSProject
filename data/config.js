const fs = require ('fs');
const path = require ('path');
const yargs = require('yargs').argv;

exports.env = yargs.env ? yargs.env.toString() : "";

exports.envs = {
  ETL: {
    url: '',
    api: 'https://' + exports.env + '-xcelerateetl.api.rsmus.com/api/v1'
  },
  CEM: {
    url: '',
    api: 'https://' + exports.env + '-xceleratecem.api.rsmus.com/api/v1',
  },
  CDS: {
    url: '',
    api: 'https://' + exports.env + '-xceleratecds.api.rsmus.com/api/v1',
  },
  timeout: 10000,
  token:'eyJraWQiOiI1RUp4cHZqMGZTQUgtVkVTdlFwcmJRdlRpOTJkWVY0ZWljNktfUFE0eEVvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlQyXzV0cVlfblo4S1hFYzNtM0IycjA4NHR4anBpRnpNWU5iM2F0VzBaR2ciLCJpc3MiOiJodHRwczovL3ByZXZpZXcucnNtaWRlbnRpdHkuY29tL29hdXRoMi9hdXNxaHQ5cEpPQnY1QmM2cjFkNSIsImF1ZCI6ImFwaTovL3JzbXVpZCIsImlhdCI6MTY0NjIxNTIxOCwiZXhwIjoxNjQ2MjIyNDE4LCJjaWQiOiIwb2ExMGlvOW9id2lZT0c1ODFkNyIsInVpZCI6IjAwdTJic200OG9KU1U3U20zMWQ3Iiwic2NwIjpbInByb2ZpbGUiLCJvcGVuaWQiXSwic3ViIjoiRGhhc2hpbmFtb29ydGh5LlBhbGFuaWFwcGFuQHJzbXVzLmNvbSIsInJzbXVpZCI6IkUwOTE1MzEiLCJGaXJzdE5hbWUiOiJEaGFzaGluYW1vb3J0aHkiLCJuYW1lIjoiUGFsYW5pYXBwYW4sIERoYXNoaW5hbW9vcnRoeSIsImdyb3VwcyI6WyJFdmVyeW9uZSIsIkNEUyIsIkludGVybmFsIFVzZXJzIiwidGVzdEdyb3VwIiwiWGNlbGVyYXRlIFNGVFAgREVWIiwiSURNIEFkbWluIENlbnRlciIsIkNFTSIsIkVUTCJdLCJMYXN0TmFtZSI6IlBhbGFuaWFwcGFuIn0.fpVXEOFV3ThZAfaPXuDxqNnBWaXVFMwpM5x2FiRzPdb-Vw8Mht9shxTWLiSRKUx93Uayyuq-BRENKMm6T1P38ar4m20jZRlhl1KDI2IkFv4XDFJjBe64987qqIzV9DMvrTvGMTbAKaTVDSq6GnxMLDWHX-Ec86Kg1tR75aOhtpQGl0GUHSTwR3rwQSrk5tHgq1QVef7D4mcurfG-ZS58x4BVTG5ye64Uj4QQeRuxvY3GgLiaXY2SLqoQl83-M9xRdnbkq0siDSHySe5hXBeWx4pnHF4-o-Nkzc_SO_mhnkH8Tv1BIK1mhXQ7o5-F83X9Gna5tPLuFhB7JJ_LIjSOVw'
 // token: 'eyJraWQiOiI1RUp4cHZqMGZTQUgtVkVTdlFwcmJRdlRpOTJkWVY0ZWljNktfUFE0eEVvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkFZOHozTmRBeVc1aE1wZDJBMkpVRUVOMnJ5ZDNBT2dsclVMNGd3ay1tb00iLCJpc3MiOiJodHRwczovL3ByZXZpZXcucnNtaWRlbnRpdHkuY29tL29hdXRoMi9hdXNxaHQ5cEpPQnY1QmM2cjFkNSIsImF1ZCI6ImFwaTovL3JzbXVpZCIsImlhdCI6MTY0NjIxOTgwNiwiZXhwIjoxNjQ2MjI3MDA2LCJjaWQiOiIwb2F1cGI1aWNmUGVHYzd3bDFkNiIsInNjcCI6WyJjbGllbnRfYWNjZXNzIl0sInN1YiI6IjBvYXVwYjVpY2ZQZUdjN3dsMWQ2In0.iQli3Xe13ZA4orIhrjndDuitkzJHJ4EVCbb9l9UvxK2TPearHyLGbNiWg37M98T3hPqWVHwVgPq0PpIx3G7paYLF9dLC1GPX0ydGdDFIniJaPSUjiMlNCv7w6448Sc09Q_GpJnKUIJYbWDkddpqWAQUY8zjQXyXDTqEFBSRFitldwLfG74TTHO3YEWRE6i_gT43OSn3l0-RUvx0lwFWyF4Ke3YhcqQ29YJ8MBwYigWQ8WA1Q7k6Cy50an4cWRjlU9wCF-tFZiBuI-SQHuImBlyFaj0RyzzIsXjn-BGYEeMRFgjJ-8zmgqUU60h7o4uhHo3wOjcwelj6yIvaouZAglg'
};
exports.requests = {
  ETL: {
    alterixWF: '/alteryxworkflows',
    alteryxjob: '/alteryxjob',
    alteryxQuestions: '/alteryxquestions',
    applications: '/applications',
    byAppId: 'applicationid%20eq%20',
    byClient: 'mdmclientid%20eq%20',
    byProtocolTypeName: 'protocolTypeName%20eq%20',
    byProtocolTypeId: 'protocoltypeid%20eq%20',
    files: '/files',
    protocols: '/protocols',
    processFile: '/processfile',
    matchedFiles: '/matchedfiles',
    payloadDefinitions: '/payloaddefinitions',
    prepareuris: '/directprocedureexecution/prepareuris',
    protocolTypes: '/protocoltypes',
    procedures: '/procedures',
    withTop: '?%24top=',
    withSkip: '?%24skip=',
    withFilter: '?%24filter=',
    comma: '%27'
  },
  CEM: {
    assignments: '/Assignments',
    authorization: '/Authorization',
    clients: '/Clients',
    engagements: '/Engagements',
    legalEntities: '/LegalEntities',
    projects: '/Projects',
    userRoles: '/UserRoles',
    users: '/Users',
    projects: '/Projects',
    configuarations : '/UIConfigurations'
  },
  CDS: {
    bulkinsert: '/bulkinsert',
    clients: '/clients',
    legalEntities: '/legalentities',
    projectTypes: '/projecttypes',
    withFilter: '?%24filter=',
    byGuid: 'id%20in%20',
    byMdmClientId: 'mdmClientId%20in%20',
    byMdmMasterClientId: 'mdmMasterClientId%20in%20',
    byName: 'name%20in%20',
    openBracket: '%28',
    closeBracket: '%29',
    comma: '%27'
  }
};

exports.invalidData = {
  incorrectProtocolTypeId: '00000000-0000-0000-0000-000000012345',
  notExistingMdmClientId: 1234567,
  notExistingProtocolId: '00000000-0000-0000-0000-000000012345',
  invalidProtocolTypeName: "ooo",
  invalidId: '00000000-0000-0000-0000-000000000000',
  noAccessLegalEntityId: '00000000-0000-0000-0000-000000000001',
  longValue: '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
}