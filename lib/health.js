'use strict';

var _ = require('lodash');
var Promise = require('./promise');
var notifications = require('./notifications');
var errors = require('./errors');
var stats = require('./stats');

function check() {
  return new Promise(function(resolve, reject) {
    resolve(true)
  });
}

exports.run = function(event, context) {
  stats.timerStart('health');
  return check()
    .catch(function(e) {
      errors.capture('Error occurred during healthcheck.. ', e);
    })
    .finally(function() {
      stats.timerStop('health');
      stats.disconnect();
    });
};
