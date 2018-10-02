const { Given, When, Then } = require('cucumber')
// const expect = require('expect.js')
const utils = require('../../utils')

Given('I have no indexes', async function() {
  browser.url('/')
  utils.selectorIsNotPresent(browser, '.IndexBoxed')
})

Given(/The empty indexes list is well-formed/, async function() {
  const screenshotName = 'data.indexes.empty'
  const currentScreenshotPath = utils.getCurrentScreenshotPath(screenshotName)
  await utils.waitForSelector(browser, '.IndexesPage')

  await utils.elementScreenshot(browser, '.IndexesPage', currentScreenshotPath)
  await utils.compareScreenshot(screenshotName)
})

Given(/The indexes list is well-formed/, async function() {
  const screenshotName = 'data.indexes.oneindex'
  const currentScreenshotPath = utils.getCurrentScreenshotPath(screenshotName)
  await utils.waitForSelector(browser, '.IndexesPage')

  await utils.elementScreenshot(browser, '.IndexesPage', currentScreenshotPath)
  await utils.compareScreenshot(screenshotName)
})

When(/I create a new index called (.*)/, async function(name) {
  await utils.click(browser, '.IndexesPage-createBtn')

  await utils.waitForSelector(browser, '.CreateIndexModal-name')
  await utils.type(browser, '.CreateIndexModal-name', name)

  await utils.wait(browser, 1000)

  await utils.click(browser, '.CreateIndexModal-createBtn')
})

When(/I delete the (.*) index/, async function(indexName) {
  await utils.click(
    browser,
    `.IndexBoxed[title=${indexName}] .IndexBoxed-dropdown`
  )
  await utils.click(
    browser,
    `.IndexBoxed[title=${indexName}] .IndexDropdown-delete`
  )

  await utils.waitForSelector(browser, '.IndexDeleteModal-name')
  await utils.type(browser, '.IndexDeleteModal-name', indexName)
  await utils.click(browser, '.IndexDeleteModal-deleteBtn')
  await utils.wait(browser, 2000)
})

Then(/I can(not)? see the (.*) index in the list/, async function(not, name) {
  // await utils.selectorIsNotPresent(browser, '.CreateIndexModal .modal-content')
  await browser.waitForVisible('.CreateIndexModal .modal-content', 3000, true)

  const selector = `.IndexBoxed[title="${name}"]`

  if (not) {
    await utils.selectorIsNotPresent(browser, selector)
  } else {
    await utils.waitForExist(browser, selector)
  }
})

Then('I get an error in the index creation modal', async function() {
  await utils.waitForSelector(browser, '.CreateIndexModal-error')
})
