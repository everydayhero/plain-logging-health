'use strict';

var request = require('superagent');

var DEFAULT_INTERVAL = 2500;
var connected = false;
var host = null;
var stats = '';
var namespace = '';
var buffer = null;
var timers = {};
var reqSent = null;
var reqReady = null;

function doIt(rate) {
  rate = rate || 1;
  return Math.random() <= rate;
}

function initialiseRequest() {
  if (host && !reqReady) { reqReady = request.post(host).type('text/plain'); }
}

function queue(metric) {
  stats += (metric + '\n');
  initialiseRequest();
}

function clearQueue() {
  stats = '';
}

function handleSentQueue() {
  if (!connected) { unsetAll(); }
  reqSent = null;
  clearQueue();
}

function sendQueue() {
  if (reqReady) {
    reqSent = reqReady.send(stats).end(handleSentQueue);
    reqReady = null;
  } else {
    clearQueue();
  }
}

function m(name, val, type, rate) {
  var m = [namespace, name.replace(/[^\.\w+]/g, '_'), ':', val, '|', type].join('');
  return rate ? m + '@' + rate : m;
}

function unsetAll() {
  clearInterval(buffer);
  host = null;
  buffer = null;
}

var statsd = {
  _getQueue: function() {
    return stats;
  },

  connect: function(options) {
    host = options.host;
    namespace = options.namespace ? options.namespace += '.' : namespace;
    if (host) {
      buffer = setInterval(sendQueue, options.interval || DEFAULT_INTERVAL);
      connected = true;
    }
    return statsd;
  },

  disconnect: function() {
    connected = false;
    sendQueue();
  },

  count: function(name, val, rate) {
    doIt(rate) && queue(m(name, val, 'c', rate));
  },

  increment: function(name, rate) {
    doIt(rate) && queue(m(name, 1, 'c', rate));
  },

  decrement: function(name, rate) {
    doIt(rate) && queue(m(name, -1, 'c', rate));
  },

  timerStart: function(name, rate) {
    var start = new Date().getTime();
    if(!timers[name]) {
      timers[name] = function() {
        doIt(rate) && queue(m(name, new Date() - start, 'ms', rate));
      }
    }
  },

  timerStop: function(name) {
    if(timers[name]) {
      timers[name]();
      delete timers[name];
    }
  },

  gauge: function(name, val, rate) {
    doIt(rate) && queue(m(name, val, 'g', rate));
  },

  flush: sendQueue
};

module.exports = statsd;
