'use strict'

require('dotenv-safe').load({
  sample: './.env.requirements'
})

var health = require('./lib/health.js')

module.exports = {
  health: (e, ctx) => {
    health(e, ctx)
      .then(ctx.succeed)
      .catch(ctx.fail)
  }
}
