const _ = require('lodash')
const path = require('path')
const constants = require('./constants')
const itc = require('itunesconnectanalytics')
const AnalyticsQuery = itc.AnalyticsQuery
const { getConfig, parseConfiguration } = require('./helpers/configHelper')
const { generateCsvFile, generateManifests } = require('./helpers/csvHelper')
const { getInstance, getCurrentProvider, getAllProviders, changeProvider, getApps, doQuery } = require('./helpers/callerHelper')

/**
 * This function is the main program.
 * Reads and parse the input configuration.
 * Reads data from iTunes Analytics API
 *
 * @param {string} dataDir - input directory.
 * @returns {undefined}
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

module.exports = async (dataDir) => {
    const configFile = path.join(dataDir, constants.CONFIG_FILE)
    const outputFilesDir = path.join(dataDir, constants.OUTPUT_FILES_DIR)

    try {
        const config = parseConfiguration(getConfig(configFile))
        var apps = []
        var values = []

        console.log("Version: 2.0.4")
        console.log(`Changed In Last ${config.changedInLastDays} Days.`)
        console.log(`Provider(s): ${config.providers}`)
        console.log(`Metric(s): ${config.metrics}`)

        // login
        var connector = await getInstance(config.username, config.password)
        var currentProvider = await getCurrentProvider(connector)

        if(_.isUndefined(currentProvider.providerId)) {
            console.error("WARNING: No provided received. Sleeping few seconds and relogin.")
            await sleep(5000)
            connector = await getInstance(config.username, config.password)
            currentProvider = await getCurrentProvider(connector)
        }

        var providers = config.providers
        // if (_.isNull(providers)) {
        //     providers = await getAllProviders(connector)
        // }

        // console.log(JSON.stringify(providers, null, 2))

        // for (const i in providers) {
            var providerId = providers //providers[i]
            //console.log(JSON.stringify(providerId, null, 2))
            console.log("currentProvider: " + JSON.stringify(currentProvider, null, 2))

            if (providerId == currentProvider.providerId) {
            } else {
                await changeProvider(connector, providerId)
                currentProvider = await getCurrentProvider(connector)
                console.log("currentProvider: " + JSON.stringify(currentProvider, null, 2))
            }

            var pApps = await getApps(connector, currentProvider.providerId)
            if(_.isEmpty(pApps)) {
                console.error("WARNING: No apps received. Sleeping few seconds and try again.")
                await sleep(3000)
                pApps = await getApps(connector, currentProvider.providerId)
            }
            apps = apps.concat(pApps)

            for (var j in pApps) {
                // if (j > 0) continue
                var app = pApps[j];
                console.log("App (" + app.adamId + " " + app.name + ") processing ...")

                var query = AnalyticsQuery.metrics(app.adamId, {
                    measures: config.metrics,
                }).time(config.changedInLastDays, 'days');

                var result = await doQuery(connector, query)
                values = values.concat(result)

                // console.log("-------")
            }
        // }

        // OUTPUT
        await generateCsvFile(outputFilesDir, `apps.csv`, apps)
        await generateCsvFile(outputFilesDir, `data.csv`, values)
        console.log('Data has been read successfully!')

        await generateManifests(outputFilesDir)
        process.exit(constants.EXIT_STATUS_SUCCESS)
    } catch (error) {
        console.error(error.message ? error.message : error)
        console.error(error.stack)
        process.exit(constants.EXIT_STATUS_FAILURE)
    }
}
