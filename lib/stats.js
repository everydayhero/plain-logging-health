'use strict';

var stats = require('./_statsd');
var url = require('url');
var statsd_url = url.parse(process.env.STATSD_URL);

module.exports = stats.connect({
  host: statsd_url.host,
  namespace: statsd_url.query, 
  interval: 250
})
