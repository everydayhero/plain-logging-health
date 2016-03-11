'use strict';

require('dotenv-safe').load({
  sample: './.env.requirements'
});

var health = require('./lib/health.js');

module.exports = {
  health: function(e, ctx) {
    health.run(e, ctx)
      .then(ctx.succeed)
      .catch(ctx.fail);
  }
}
