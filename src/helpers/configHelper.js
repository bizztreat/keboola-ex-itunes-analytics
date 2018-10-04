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
    // const apiURI = configObject.get('parameters:apiURI')
    // if (_.isUndefined(apiURI) || _.isEmpty(apiURI)) {
    //   throw new Error('Parameter apiURI is empty/not defined')
    // }

    const username = configObject.get('parameters:#username')
    if (_.isUndefined(username) || _.isEmpty(username)) {
      throw new Error('Parameter #username is empty/not defined')
    }

    const password = configObject.get('parameters:#password')
    if (_.isUndefined(password) || _.isEmpty(password)) {
      throw new Error('Parameter #password is empty/not defined')
    }

    // const granularity = !_.isUndefined(configObject.get('parameters:granularity'))
    //   ? configObject.get('parameters:granularity')
    //   : DATA_GRANULARITY_DEFAULT

    // const measurementId = configObject.get('parameters:measurementId')
    // if (_.isUndefined(measurementId) || _.isEmpty(measurementId)) {
    //   throw new Error('Field measurementId is empty/not defined')
    // }
    // const measurementId = !_.isUndefined(configObject.get('parameters:measurementId'))
    // ? configObject.get('parameters:measurementId')
    // : null

    // const changedIn = configObject.get('parameters:changedInLast')
    // if (_.isUndefined(changedIn) || _.isEmpty(changedIn)) {
    //   throw new Error('Field changedInLast is empty/not defined')
    // }
    const changedInLastDays = !_.isUndefined(configObject.get('parameters:changedInLastDays'))
    ? configObject.get('parameters:changedInLastDays')
    : CHANGED_IN_LAST_DEFAULT

    if(!_.isNumber(parseInt(changedInLastDays))) {
      throw new Error('Field changedInLastDays is not a number format!')
    }

    // const unitOfTime = changedIn.slice(-1)
    // const allowedUnits = ["m", "h", "d", "M"]
    // if(allowedUnits.indexOf(unitOfTime) == -1) {
    //   throw new Error('Field changedInLast contains unknown unit of time. Use one of these [m, h, d, M]')
    // }

    // console.log("-"+configObject.get('parameters:metadocuments')+"-")

    // const metadocuments = !_.isUndefined(configObject.get('parameters:metadocuments'))
    // ? configObject.get('parameters:metadocuments')
    // : false

    // const changedInLast = {
    //   amount: amount,
    //   unitOfTime: unitOfTime
    // }

    return {
      username,
      password,
      changedInLastDays
    }
  } catch (error) {
    throw new Error(`Problem in the input configuration - ${error.message}`)
  }
}
