const { Given, When, Then } = require('cucumber')
const expect = require('expect.js')
const utils = require('../../utils')
const fmt = require('../../../../src/utils').formatForDom

Given('I open the admin console with no environments', async function() {
  browser.url('/')
  await utils.selectorIsNotPresent(browser, '.EnvironmentsSwitch-env')
})

When(
  /I create a new (in)?valid environment called (\w*)( with color )?(\d?)/,
  async function(invalid, envName, withColor, colorIndex) {
    const kuzzleHost = invalid === 'in' ? 'invalid' : this.kuzzleHostname
    // try {
    //   await utils.click(browser, '.EnvironmentsSwitch > .btn-flat')
    //   await utils.click(browser, '.EnvironmentsSwitch-newConnectionBtn')
    // } catch (error) {}

    await utils.waitForSelector(browser, '.CreateEnvironment-name')

    await utils.type(browser, '.CreateEnvironment-name', envName)
    await utils.type(browser, '.CreateEnvironment-host', kuzzleHost)

    if (colorIndex) {
      await utils.click(
        browser,
        `.CreateEnvironment-colorBtns div:nth-child(${colorIndex}) div.color`
      )
    }

    await utils.click(browser, '.Environment-SubmitButton')
  }
)

When(/I delete the environment called (.*)/, async function(envName) {
  await utils.click(browser, '.EnvironmentsSwitch > .btn-flat')

  utils.wait(browser, 1000)
  await utils.click(
    browser,
    `.EnvironmentsSwitch-env[data-env=env_${fmt(envName)}] > i.fa-trash`
  )

  await utils.click(browser, '.EnvironmentDeleteModal-envName')
  await utils.type(browser, '.EnvironmentDeleteModal-envName', envName)
  await utils.click(browser, 'div > #delete-env > .modal-footer > span > .btn')
})

When(/I switch to the (\w*) environment/, async function(envName) {
  await utils.click(browser, '.EnvironmentsSwitch > .btn-flat')

  await utils.wait(browser, 1000)
  await utils.click(
    browser,
    `.EnvironmentsSwitch-env[data-env=env_${fmt(envName)}]`
  )
})

Then(/I should see (.*) in the environment dropdown/, async function(envName) {
  await utils.click(browser, '.EnvironmentsSwitch > .btn-flat')

  await utils.waitForSelector(
    browser,
    `.EnvironmentsSwitch-env[data-env="env_${envName}"]`
  )
})

Then(/I should not see (.*) in the environment dropdown/, async function(
  envName
) {
  // await utils.click(browser, '.EnvironmentsSwitch > .btn-flat')

  await utils.selectorIsNotPresent(
    browser,
    `.EnvironmentsSwitch-env[data-env="env_${envName}"]`
  )
})

Then(
  'The environment creation form is visible and well formed',
  async function() {
    const screenshotName = 'no-env.create'
    const currentScreenshotPath = utils.getCurrentScreenshotPath(screenshotName)
    await utils.waitForSelector(browser, '.CreateEnvironmentPage')

    await utils.elementScreenshot(
      browser,
      '.CreateEnvironmentPage',
      currentScreenshotPath
    )
    await utils.compareScreenshot(screenshotName)
  }
)

Then('I am connected to the selected environment', async function() {
  await utils.waitForSelector(browser, '.App-connected', 10000)
})

Then('I am not connected to Kuzzle', async function() {
  await utils.waitForSelector(browser, '.App-errored', 10000)
})

Then(
  /I should see that the navbar has the background color (.*)/,
  async function(color) {
    await utils.waitForSelector(browser, 'nav')
    const headerColor = await utils.$$eval(
      browser,
      'nav',
      nodes => nodes[0].style.backgroundColor
    )
    expect(headerColor).to.be.eql(color)
  }
)
