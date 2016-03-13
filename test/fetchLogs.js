'use strict'

var fetchLogs = require('../lib/fetchLogs');
var moment = require('moment');
var clock = moment.utc('2016-03-12T23:15:00+00:00');

describe('fetchLogs', function() {
  describe('when logs exist', function() {
    it('enriches the input object with information about recent kibana logs', function() {
      this.timeout(5000);

      var input = {
        id: 'i-0fba13b9',
        name: 'staging-a-clock-0fba13b9'
      };

      var expectedOutput = {
        'id': 'i-0fba13b9',
        'lastEntry': {
          'createdAt': '2016-03-12T23:14:33+00:00',
          'id': 'AVNtHGNSbelSLPRvDRrA',
          'latencyHuman': 'a few seconds',
          'latencySeconds': 27
        },
        'name': 'staging-a-clock-0fba13b9',
        'searchedAt': '2016-03-12T23:15:00+00:00'
      };

      return fetchLogs(input, clock)
        .then(function(output) {
          expect(output).to.eql(expectedOutput);
        })
    });
  });

  describe('when logs do not exist', function() {
    it('enriches the input object accordingly', function() {
      this.timeout(5000);

      var input = {
        id: 'i-000',
        name: 'staging-x-never-000'
      };

      var expectedOutput = {
        'id': 'i-000',
        'lastEntry': null,
        'name': 'staging-x-never-000',
        'searchedAt': '2016-03-12T23:15:00+00:00'
      };

      return fetchLogs(input, clock)
        .then(function(output) {
          expect(output).to.eql(expectedOutput);
        })
    });
  });
});
