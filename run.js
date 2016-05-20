'use strict'

require('dotenv-safe').load({
  sample: './.env.requirements'
})

import health from './lib/health.js'

health()
// console.log('herere')
