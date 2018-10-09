const _ = require('lodash')
const nconf = require('nconf')
const isThere = require('is-there')
const {
  CHANGED_IN_LAST_DEFAULT
} = require('../constants')

module.exports = {
  getConfig,
  parseConfiguration
}

/**
 * This function reads and parse the config passed via args.
 *
 * @param {string} configPath - a path to a configuration.
 * @param {function} fileExist - a simple function that checks whether a file exists .
 * @returns {Object}
 */
function getConfig(configPath, fileExist = isThere) {
  if (fileExist(configPath)) {
    return nconf.env().file(configPath)
  } else {
    return {}
  }
}

/**
 * This function reads verifies the input configuration and returns relevant params.
 *
 * @param {Object} configObject - nconf object with the input configuration.
 * @throws {error}
 * @returns {Object}
 */
function parseConfiguration(configObject = {}) {
  try {
    const username = configObject.get('parameters:#username')
    if (_.isUndefined(username) || _.isEmpty(username)) {
      throw new Error('Parameter #username is empty/not defined')
    }

    const password = configObject.get('parameters:#password')
    if (_.isUndefined(password) || _.isEmpty(password)) {
      throw new Error('Parameter #password is empty/not defined')
    }

    const metrics = configObject.get('parameters:metrics')
    if (_.isUndefined(metrics) || _.isEmpty(metrics)) {
      throw new Error('Field metrics is empty/not defined')
    }

    const providerId = configObject.get('parameters:providerId')
    const providers = !_.isUndefined(providerId) && !_.isEmpty(providerId)
      ? providerId
      : null

    const changedInLastDays = !_.isUndefined(configObject.get('parameters:changedInLastDays'))
      ? configObject.get('parameters:changedInLastDays')
      : CHANGED_IN_LAST_DEFAULT

    if (!_.isNumber(parseInt(changedInLastDays))) {
      throw new Error('Field changedInLastDays is not a number format!')
    }

    return {
      username,
      password,
      providers,
      metrics,
      changedInLastDays
    }
  } catch (error) {
    throw new Error(`Problem in the input configuration - ${error.message}`)
  }
}
