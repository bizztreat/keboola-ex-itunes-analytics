const _ = require('lodash')
const itc = require('itunesconnectanalytics')
const Itunes = itc.Itunes
const AnalyticsQuery = itc.AnalyticsQuery
const {
    EXIT_STATUS_FAILURE
} = require('../constants')

module.exports = {
    getInstance,
    getCurrentProvider,
    getAllProviders,
    changeProvider,
    getApps,
    doQuery
}

async function getInstance(username, password) {
    return new Promise((resolve, reject) => {
        var instance = new Itunes(username, password, {
            errorCallback: function (error) {
                console.log('Error logging in: ' + error);
                reject(error);
            },
            successCallback: function (d) {
                console.log('Logged in.');
                resolve(instance)
            }
        });
    })
}

async function getCurrentProvider(instance) {
    return new Promise((resolve, reject) => {
        instance.getAPIURL('https://analytics.itunes.apple.com/analytics/api/v1/settings/user-info', function (error, result) {
            if (error) {
                reject(error)
            } else {
                var provider = { providerId: result.providerId, providerName: result.providerName }
                resolve(provider)
            }
        })
    })
}

async function getAllProviders(instance) {
    return new Promise((resolve, reject) => {
        instance.getAPIURL('https://analytics.itunes.apple.com/analytics/api/v1/settings/user-info', function (error, result) {
            if (error) {
                reject(error)
            } else {
                console.log(result)
                var providers = result.contentProviders.map(function (item) {
                    return item.providerId
                });
                resolve(providers)
            }
        })
    })
}

function changeProvider(instance, providerId) {
    return new Promise((resolve, reject) => {
        instance.changeProvider(providerId, function (error) {
            if (error) {
                reject(error)
            } else {
                console.log('Provider changed successfully.');
                resolve()
            }
        })
    })
}

async function getApps(instance, providerId) {
    return new Promise((resolve, reject) => {
        instance.getApps(function (error, result) {
            if (error) {
                reject(error)
            } else {
                var values = []

                //console.log(JSON.stringify(result, null, 2))
                
                if (_.isUndefined(result.results)) {
                    console.log('WARNING No apps found! Maybe too many requests in time and API denied them.');
                    resolve(values)
                } else {
                    values = result.results.map(function (p, i) {
                        return ({
                            name: p.name,
                            adamId: p.adamId,
                            isBundle: p.isBundle,
                            iconUrl: p.iconUrl,
                            assetToken: p.assetToken,
                            platforms: p.platforms,
                            isEnabled: p.isEnabled,
                            appOptInRate: p.appOptInRate,
                            preOrderInfo: p.preOrderInfo,
                            providerId: providerId
                        });
                    });

                    resolve(values)
                }
            }
        })
    })
}

// Get installs for each day in date range 2016-04-10 to 2016-05-10
async function doQuery(instance, query) {
    return new Promise((resolve, reject) => {
        instance.request(query, function (error, result) {
            if (error) {
                reject(error)
            } else {
                // console.log(JSON.stringify(query, null, 2))
                var options = {
                    adamId: query.adamId,
                }

                resolve(parseData(result, options))
            }
        })
    })
}

/**
 * This function xxxx
 *
 * @param {Object} options - an options object.
 * @returns {Object}
 */
function parseData(response, options) {
    var values = []
    // console.log(JSON.stringify(response, null, 2))

    for (var i in response.results) {
        var data = response.results[i].data

        var result = data.map(function (p, i) {
            var metricName = Object.keys(p)[1]
            return ({
                date: p.date,
                metric: metricName,
                value: p[metricName],
                appId: options.adamId,
            });
        });

        values = values.concat(result)
    }

    return values
}