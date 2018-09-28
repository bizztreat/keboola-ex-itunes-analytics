const _ = require('lodash')
const path = require('path')
const rp = require('request-promise')
const moment = require('moment')
const constants = require('./constants')

/**
 * This function is the main program.
 * Reads and parse the input configuration.
 * Reads data from iTunes Analytics API
 *
 * @param {string} dataDir - input directory.
 * @returns {undefined}
 */
module.exports = async (dataDir) => {
    const configFile = path.join(dataDir, constants.CONFIG_FILE)
    //const inputFilesDir = path.join(dataDir, constants.INPUT_FILES_DIR)
    const outputFilesDir = path.join(dataDir, constants.OUTPUT_FILES_DIR)

    try {
        // const config = parseConfiguration(getConfig(configFile))
        var options
        var values = []

        console.log("Version: 0.1.0 alfa")

        // await generateManifests(outputFilesDir)
        process.exit(constants.EXIT_STATUS_SUCCESS)
    } catch (error) {
        console.error(error.message ? error.message : error)
        process.exit(constants.EXIT_STATUS_FAILURE)
    }
}