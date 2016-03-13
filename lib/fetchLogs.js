'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('./promise');
var request = require('request');

function hostnameQueryString(hostname) {
  return 'journalctl.hostname: "' + hostname + '"'
}

function queryPayload(hostname) {
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
            'query': hostnameQueryString(hostname),
            'analyze_wildcard': true
          }
        }
      }
    }
  }
}

function formatResponse(host, clock, response) {
  var now = clock || moment.utc();
  var log = response.toJSON().body.hits.hits[0]

  if (log) {
    var loggedAt = moment.utc(log._source['@timestamp'], moment.ISO_8601);
    var latency = moment.duration(now.diff(loggedAt))

    host.lastEntry = {
      id: log._id,
      createdAt: loggedAt.format(),
      latencySeconds: latency.asSeconds(),
      latencyHuman: latency.humanize(),
    }

  } else {
    host.lastEntry = null;
  }

  host.searchedAt = now.format();
  return host;
}

module.exports = function(host, clock) {
  return new Promise(function(resolve, reject) {
    var callback = function callback(error, response) {
      if (error) {
        console.log(error)
        reject(error);
      }

      resolve(formatResponse(host, clock, response));
    }

    var options = {
      method: 'POST',
      url: process.env.SEARCH_URL,
      headers: {
        Accept: 'application/json',
        'kbn-xsrf-token': 'kibana'
      },
      auth: {
        user: process.env.SEARCH_USER,
        pass: process.env.SEARCH_PASSWORD,
        sendImmediately: true
      },
      json: true,
      body: queryPayload(host.name)
    };

    request(options, callback);
  });
}
