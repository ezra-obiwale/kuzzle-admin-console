const BlinkDiff = require('blink-diff')
const cloudinary = require('cloudinary')
const fs = require('fs')
const path = require('path')

const threshold = 0.1
const defaultWaitElTimeout = process.env.waitElTimeout || 3000
const paths = {
  base: `${__dirname}/visual-regression`,
  reference: 'reference',
  current: 'current',
  diff: 'diff'
}

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name || 'kuzzle',
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
})

/**
 * Send a picture to Cloudinary.
 *
 * @param {String} path The path of the file to send
 * @param {String} publicId The publicId to set on the file
 * @param {Array} tags The list of tags to set on the file
 */
const sendToCloudinary = (path, publicId, tags) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      {
        public_id: publicId,
        tags
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      }
    )
  })
}

/**
 * Compute the path of a screenshot for visual regression testing.
 *
 * @param {String} name The name of the screenshot
 */
const getCurrentScreenshotPath = name => {
  return path.join(paths.base, paths.current, name + '.png')
}

/**
 * Performs visual diff between two screenshots with a given name.
 * For the comparison to be possible, a screenshot with the specified
 * name must exist in the `current` directory and another one with
 * the same name must exist in the `reference` directory. A diff file
 * with the same name (suffixed with `diff`) is created in the `diff`
 * directory.
 *
 * @param {String} name The name of the screenshot to compare with reference.
 */
const compareScreenshot = async name => {
  const currentScreenshotPath = getCurrentScreenshotPath(name)
  const referenceScreenshotPath = path.join(
    paths.base,
    paths.reference,
    name + '.png'
  )
  const diffScreenshotPath = path.join(paths.base, paths.diff, name + '.png')

  if (!fs.existsSync(referenceScreenshotPath)) {
    if (process.env.updatingVisualReference) {
      return true
    }
    throw new Error(
      `Missing reference for screenshot ${name}. Did you run "npm run e2e-update-reference" ?`
    )
  }

  const diff = new BlinkDiff({
    imageAPath: referenceScreenshotPath,
    imageBPath: currentScreenshotPath,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold,
    imageOutputPath: diffScreenshotPath
  })

  const diffResult = await diff.runWithPromise()

  if (diffResult.code === 1) {
    throw new Error(
      `Screenshot differences are over the threshold: ${diffResult.differences}`
    )
  }
}

/**
 *
 * @param {WebdriverIO.Client} page
 * @param {String} selector
 * @param {Number} timeout In milliseconds
 */
const waitForExist = async (page, selector, timeout) => {
  if (!page) {
    throw new Error('waitForExist: Please provide a page instance')
  }
  try {
    await page.waitForExist(selector, timeout || defaultWaitElTimeout)
  } catch (error) {
    throw new Error(
      `Something went wrong waiting for ${selector} to appear. ${error.message}`
    )
  }
}

const waitForVisible = async (page, selector, timeout) => {
  if (!page) {
    throw new Error('waitForExist: Please provide a page instance')
  }
  try {
    await page.waitForVisible(selector, timeout || defaultWaitElTimeout)
  } catch (error) {
    throw new Error(
      `Something went wrong waiting for ${selector} to appear. ${error.message}`
    )
  }
}

const click = async (page, selector) => {
  if (!page) {
    throw new Error('click: Please provide a page instance')
  }
  try {
    await waitForExist(page, selector)
    await page.click(selector)
  } catch (error) {
    throw new Error(
      `Something went wrong clicking ${selector}. ${error.message}`
    )
  }
}

const wait = async (page, timeout) => {
  try {
    await page.waitUntil(() => false, { timeout })
  } catch (error) {}
}

const selectorIsNotPresent = async (page, selector, timeout) => {
  if (!page) {
    throw new Error('click: Please provide a page instance')
  }
  await page.waitForExist(selector, timeout || defaultWaitElTimeout, true)
}

const screenshot = async (page, path) => {
  await page.saveScreenshot(path)
  try {
    fs.chmodSync(path, 0o777)
  } catch (error) {}
}

const elementScreenshot = async (page, selector, path) => {
  await page.saveElementScreenshot(selector, path)
  try {
    fs.chmodSync(path, 0o777)
  } catch (error) {}
}

const type = async (page, selector, text) => {
  if (!page) {
    throw new Error('click: Please provide a page instance')
  }
  try {
    await waitForExist(page, selector)
    await page.setValue(selector, text)
  } catch (error) {
    throw new Error(
      `Something went wrong typing into ${selector}. ${error.message}`
    )
  }
}

const $$eval = async (page, selector, script, arg) => {
  if (!page) {
    throw new Error('click: Please provide a page instance')
  }
  try {
    return await page.selectorExecute(selector, script, arg)
  } catch (error) {
    throw new Error(
      `Something went executing function into ${selector}. ${error.message}`
    )
  }
}

module.exports = {
  getCurrentScreenshotPath,
  compareScreenshot,
  visualRegressionPaths: paths,
  sendToCloudinary,
  waitForExist,
  waitForVisible,
  waitForSelector: waitForExist,
  selectorIsNotPresent,
  click,
  wait,
  elementScreenshot,
  screenshot,
  type,
  $$eval
}
