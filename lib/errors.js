'use strict'

var errors, noop = function() {};
var stats = require('./stats');
var Sentry = require('raven');
if (['test', 'sandbox'].indexOf(process.env.RELEASE_ENVIRONMENT) >=0) {
  errors = {
    patchGlobal: noop,
    on: noop,
    captureException: noop
  };
} else {
  errors = new Sentry.Client(process.env.SENTRY_DSN);
}

errors.patchGlobal();

errors.on('error', function(e) {
  stats.increment('sentry.error');
  console.log('Sentry error', e);
});

module.exports = {
  capture: function(reason, error, fingerprint) {
    var opts = { extra: { reason: reason }};
    if (fingerprint) {
      opts.fingerprint = ['{{ default }}', fingerprint];
    }
    errors.captureException(error, opts);
  },

  message: errors.captureMessage
};
