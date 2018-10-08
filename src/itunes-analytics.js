const _ = require('lodash')
const path = require('path')
const rp = require('request-promise')
const moment = require('moment')
const constants = require('./constants')
const itc = require('itunesconnectanalytics')
const AnalyticsQuery = itc.AnalyticsQuery
const { getConfig, parseConfiguration } = require('./helpers/configHelper')
const { generateCsvFile, generateManifests } = require('./helpers/csvHelper')
const { getInstance, getCurrentProvider, getApps, doQuery } = require('./helpers/callerHelper')

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
    const outputFilesDir = path.join(dataDir, constants.OUTPUT_FILES_DIR)

    try {
        const config = parseConfiguration(getConfig(configFile))
        var options
        var values = []

        console.log("Version: 0.2.2")
        // console.log(`username: ${config.username}`)
        // console.log(`password: ${config.password}`)
        console.log(`changedInLastDays: ${config.changedInLastDays}`)

        // login
        var connector = await getInstance(config.username, config.password)

        var provider = await getCurrentProvider(connector)
        console.log(provider)

        var apps = await getApps(connector, provider.providerId)

        for (var i in apps) {
            if(i > 0) continue
            var app = apps[i];
            console.log("App (" + app.adamId + " " + app.name + ") processing.")

            var query = AnalyticsQuery.metrics(app.adamId, {
                measures: [itc.measures.units,itc.measures.installs],
            }).time(config.changedInLastDays, 'days');

            var result = await doQuery(connector, query)
            values = values.concat(result)

            console.log("-------")
        }

        // OUTPUT
        await generateCsvFile(outputFilesDir, `apps.csv`, apps)
        await generateCsvFile(outputFilesDir, `data.csv`, values)
        console.log('Data has been read successfully!')

        await generateManifests(outputFilesDir)
        //process.exit(constants.EXIT_STATUS_SUCCESS)
    } catch (error) {
        console.error(error.message ? error.message : error)
        process.exit(constants.EXIT_STATUS_FAILURE)
    }
}