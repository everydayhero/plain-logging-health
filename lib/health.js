'use strict'

var _ = require('lodash')
var Promise = require('./promise')
var errors = require('./errors')
var stats = require('./stats')
var fetchHosts = require('./fetchHosts')
var fetchLogs = require('./fetchLogs')
var slack = require('./slack')

function latencyLimit (host) {
  var limits = {
    'build': 60 * 5,
    'buildkite': 60 * 5,
    'mesos': 60 * 5,
    'rabbit': 60 * 5,
    'admin': 60 * 5,
    'worker': 60 * 5
  }

  var limit = 60 * 5
  _.forIn(limits, function (value, key) {
    if (host.indexOf(key) >= 0) {
      limit = value
    }
  })
  return limit
}

function check () {
  return new Promise(function (resolve, reject) {
    fetchHosts()
      .then(function (hosts) {
        slack(':information_source: Checking logging health...')
        hosts.forEach(function (host) {
          console.log("Checking "+host.name)
          fetchLogs(host)
            .then(function(log) {
              console.log("Result "+host.name)
              var latencySeconds = _.get(log, 'lastEntry.latencySeconds')
              var latencyHuman = _.get(log, 'lastEntry.latencyHuman')
              var limit = latencyLimit(host.name)
              if (!latencySeconds || latencySeconds > limit) {
                console.log('FAILED ' + host.name + ' latency is ' + latencyHuman)
                slack(':sadpanda: *' + host.name + ' latency is ' + latencyHuman + '*')
              } else {
                slack(':green_heart: ' + host.name + ' latency is ' + latencyHuman)
              }
            })
            .then(function () {
              resolve(true)
            })
            .catch(function (e) {
              console.log('Error fetching logs for ' + host.name)
              console.log(e)
              reject(e)
            })
        })
      })
      .catch(function (e) {
        console.log('Error fetching hosts')
        console.log(e)
        reject(e)
      })
  })
}

exports.run = function (event, context) {
  stats.timerStart('health')
  return check()
    .catch(function (e) {
      errors.capture('Error occurred during healthcheck.. ', e)
    })
    .finally(function () {
      stats.timerStop('health')
      stats.disconnect()
    })
}
