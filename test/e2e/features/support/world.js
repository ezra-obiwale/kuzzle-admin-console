const { setWorldConstructor, setDefaultTimeout } = require('cucumber')
// const Kuzzle = require('kuzzle-sdk')

function CustomWorld() {
  this.isLocal = process.env.e2eLocal !== undefined
  // this.kuzzleHostname = this.isLocal ? 'localhost' : 'kuzzle'
  this.kuzzleHostname = 'localhost'

  this.browserOptions = {
    desiredCapabilities: {
      browserName: process.env.browser || 'chrome'
    }
  }

  this.url = 'http://localhost:3000'
  // this.url = process.env.e2eLocal
  //   ? 'http://localhost:3000'
  //   : 'http://adminconsole:3000'
}

setDefaultTimeout(60 * 1000)
setWorldConstructor(CustomWorld)
