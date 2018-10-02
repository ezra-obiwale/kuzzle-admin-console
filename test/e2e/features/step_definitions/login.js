const { Given, When, Then } = require('cucumber')
const utils = require('../../utils')

Given('I open the admin console', () => {
  browser.url('/')
  browser.setViewportSize({
    width: 1400,
    height: 900
  })
})

When('I login as anonymous', async function() {
  await utils.click(browser, '.LoginAsAnonymous-Btn')
})

Then('I am logged in', async function() {
  await utils.waitForSelector(browser, '.App-loggedIn')
})
