'use strict'

var _ = require('lodash')
var moment = require('moment')
var Promise = require('./promise')
var request = require('request')

const queryPayload = (hostname) => {
  return {
    'size': 1,
    'sort': [{
      '@timestamp': {
        'order': 'desc'
      }
    }],
    'query': {
      'filtered': {
        'query': {
          'query_string': {
            'query': hostname,
            'analyze_wildcard': true
          }
        }
      }
    }
  }
}

const formatResponse = (host, response) => {
  var now = moment.utc()
  var log = _.get(response.toJSON(), '.body.hits.hits[0]')
  if (log) {
    var loggedAt = moment.utc(log._source['@timestamp'], moment.ISO_8601)
    var latency = moment.duration(now.diff(loggedAt))

    host.lastEntry = {
      id: log._id,
      createdAt: loggedAt.format(),
      latencySeconds: latency.asSeconds(),
      latencyHuman: latency.humanize()
    }
  } else {
    host.lastEntry = null
  }

  host.searchedAt = now.format()
  return host
}

export default (host) => {
  return new Promise((resolve, reject) => {
    var callback = (error, response) => {
      if (error) {
        console.log(error)
        reject(error)
      }

      resolve(formatResponse(host, response))
    }

    const options = {
      method: 'POST',
      url: process.env.SEARCH_URL,
      headers: {
        Accept: 'application/json'
      },
      json: true,
      body: queryPayload(host.name)
    }

    request(options, callback)
  })
}
