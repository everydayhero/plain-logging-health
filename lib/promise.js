'use strict';

var Promise = require('bluebird');
var errors = require('./errors');

Promise.longStackTraces();

function handleErrors(e) {
  errors.capture(e.message || e.name || e.type, e);
}

Promise.onPossiblyUnhandledRejection(handleErrors);
process.on('unhandledRejection', handleErrors);

module.exports = Promise;
