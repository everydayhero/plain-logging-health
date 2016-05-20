#!/usr/bin/env node

(() => {
  var dotenvSave = require('dotenv-safe')
  if (!module.parent) {
    dotenvSave.load({ sample: process.argv[2] || './.env.requirements' })
  }
})()
