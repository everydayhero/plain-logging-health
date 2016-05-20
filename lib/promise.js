'use strict'

import Promise from 'bluebird'
import errors from './errors'

Promise.longStackTraces()

const handleErrors = (e) => errors.capture(e.message || e.name || e.type, e)

Promise.onPossiblyUnhandledRejection(handleErrors)
process.on('unhandledRejection', handleErrors)

export default Promise
