'use strict'

import _ from 'lodash'
import Promise from './promise'
import errors from './errors'
import stats from './stats'
import fetchHosts from './fetchHosts'
import fetchLogs from './fetchLogs'
import slack from './slack'

const latencyLimit = (host) => {
  const limits = {
    'build': 60 * 5,
    'buildkite': 60 * 5,
    'mesos': 60 * 5,
    'rabbit': 60 * 5,
    'admin': 60 * 5,
    'worker': 60 * 5
  }

  let limit = 60 * 5
  _.forIn(limits, (value, key) => {
    if (host.indexOf(key) >= 0) {
      limit = value
    }
  })
  return limit
}

const check = () => {
  return new Promise((resolve, reject) => {
    console.log('Fetch hosts...')
    fetchHosts()
      .then((hosts) => {
        console.log(hosts)
        slack(':information_source: Checking logging health...')
        hosts.forEach((host) => {
          console.log('Checking ' + host.name)
          fetchLogs(host)
            .then((log) => {
              console.log('Result ' + host.name)
              const latencySeconds = _.get(log, 'lastEntry.latencySeconds')
              const latencyHuman = _.get(log, 'lastEntry.latencyHuman')
              const limit = latencyLimit(host.name)
              if (!latencySeconds || latencySeconds > limit) {
                console.log('FAILED ' + host.name + ' latency is ' + latencyHuman)
                slack(':sadpanda: *' + host.name + ' latency is ' + latencyHuman + '*')
              } else {
                slack(':green_heart: ' + host.name + ' latency is ' + latencyHuman)
              }
            })
            .then(resolve)
            .catch((e) => {
              console.log('Error fetching logs for ' + host.name)
              console.log(e)
              reject(e)
            })
        })
      })
      .catch((e) => {
        console.log('Error fetching hosts')
        console.log(e)
        reject(e)
      })
  })
}

export default (event, context) => {
  stats.timerStart('health')
  return check()
    .catch((e) => {
      console.log('caucght')
      console.log(e)
      errors.capture('Error occurred during healthcheck.. ', e)
    })
    .finally(() => {
      stats.timerStop('health')
      stats.disconnect()
    })
}
