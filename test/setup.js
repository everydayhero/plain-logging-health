require('dotenv-safe').load({
  sample: './.env.requirements',
  path: './.env.test'
});

global._ = require('lodash');
global.chai = require('chai');
global.expect = chai.expect;
global.mockrequire = require('mockrequire');
global.Promise = require('bluebird');
global.sepia = require('sepia');
global.sinon = require('sinon');

global.mkdirp = Promise.promisify(require('mkdirp'));
global.path = require('path');
global.rimraf = Promise.promisify(require('rimraf'));
global.url = require('url');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
require('sinon-as-promised')(global.Promise);
