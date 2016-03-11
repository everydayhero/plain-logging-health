#!/usr/bin/env node

(function() {
  var dotenv_safe = require('dotenv-safe');
  if (!module.parent) {
    dotenv_safe.load({ sample: process.argv[2] || './.env.requirements' });
  }
})();
