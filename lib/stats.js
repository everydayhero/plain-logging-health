'use strict'

import stats from './_statsd'
const namespace = process.env.APP_NAME
const interval = 250
let host

if (['test', 'sandbox'].indexOf(process.env.RELEASE_ENVIRONMENT) === -1) {
  host = process.env.STATSD_HOST
}

export default stats.connect({ host, namespace, interval })
