'use strict'

import stats from './stats'
import Sentry from 'raven'
const noop = () => {}
let errors

if (['test', 'sandbox'].indexOf(process.env.RELEASE_ENVIRONMENT) >= 0) {
  errors = {
    patchGlobal: noop,
    on: noop,
    captureException: noop
  }
} else {
  errors = new Sentry.Client(process.env.SENTRY_DSN)
}

errors.patchGlobal()

errors.on('error', (e) => {
  stats.increment('sentry.error')
  console.log('Sentry error', e)
})

export default {
  capture (reason, error, fingerprint, messageId) {
    const opts = { extra: { reason: reason } }
    if (fingerprint) {
      opts.fingerprint = ['{{ default }}', fingerprint]
    }
    if (messageId) {
      opts.extra.message_id = messageId
    }
    errors.captureException(error, opts)
  },

  message: errors.captureMessage
}
