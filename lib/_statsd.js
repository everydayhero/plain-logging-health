'use strict'

import request from 'superagent'

const DEFAULT_INTERVAL = 2500
let connected = false
let host = null
let stats = ''
let namespace = ''
let buffer = null
let timers = {}
let reqReady = null

const doIt = (rate = 1) => Math.random() <= rate

const initialiseRequest = () => {
  if (host && !reqReady) reqReady = request.post(host).type('text/plain')
}

const clearQueue = () => { stats = '' }

const queue = (metric) => {
  stats += (metric + '\n')
  initialiseRequest()
}

const handleSentQueue = () => {
  if (!connected) { unsetAll() }
  clearQueue()
}

const sendQueue = () => {
  if (reqReady) {
    reqReady.send(stats).end(handleSentQueue)
    reqReady = null
  } else {
    clearQueue()
  }
}

const m = (name, val, type, rate) => {
  const m = [namespace, name.replace(/[^\.\w+]/g, '_'), ':', val, '|', type].join('')
  return rate ? `${m}@${rate}` : m
}

const unsetAll = () => {
  clearInterval(buffer)
  host = null
  buffer = null
}

const statsd = {
  _getQueue () {
    return stats
  },

  connect (options) {
    host = options.host
    namespace = options.namespace ? options.namespace += '.' : namespace
    if (host) {
      buffer = setInterval(sendQueue, options.interval || DEFAULT_INTERVAL)
      connected = true
    }
    return statsd
  },

  disconnect () {
    connected = false
    sendQueue()
  },

  count (name, val, rate) {
    doIt(rate) && queue(m(name, val, 'c', rate))
  },

  increment (name, rate) {
    doIt(rate) && queue(m(name, 1, 'c', rate))
  },

  decrement (name, rate) {
    doIt(rate) && queue(m(name, -1, 'c', rate))
  },

  timerStart (name, rate) {
    const start = new Date().getTime()
    if (!timers[name]) {
      timers[name] = () => doIt(rate) && queue(m(name, new Date() - start, 'ms', rate))
    }
  },

  timerStop (name) {
    if (timers[name]) {
      timers[name]()
      delete timers[name]
    }
  },

  gauge (name, val, rate) {
    doIt(rate) && queue(m(name, val, 'g', rate))
  },

  flush: sendQueue
}

export default statsd
