#!/usr/bin/env node

(function () {
  var dotenvSafe = require('dotenv-safe')
  if (!module.parent) {
    dotenvSafe.load({ sample: process.argv[2] || './.env.requirements' })
  }
})()
