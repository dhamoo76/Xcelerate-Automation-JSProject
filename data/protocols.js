const timestamp = Date.now()

module.exports = {
  regression: {
    correctParameters: {
      "name": "name" + timestamp,
      "mdmClientId": '',
      "protocolTypeId": '',
      "url": "www.url.com",
      "folderPath": "folderPath" + timestamp,
      "userName": "user_" + timestamp,
      "password": "password_" + timestamp
    }
  }
}