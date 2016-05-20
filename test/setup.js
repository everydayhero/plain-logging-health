require('dotenv-safe').load({
  sample: './.env.requirements',
  path: './.env.test'
})

global._ = require('lodash')
global.chai = require('chai')
global.expect = global.chai.expect
global.mockrequire = require('mockrequire')
global.Promise = require('bluebird')
global.sinon = require('sinon')

global.mkdirp = Promise.promisify(require('mkdirp'))
global.path = require('path')
global.rimraf = Promise.promisify(require('rimraf'))
global.url = require('url')

global.chai.use(require('sinon-chai'))
global.chai.use(require('chai-as-promised'))
require('sinon-as-promised')(global.Promise)
