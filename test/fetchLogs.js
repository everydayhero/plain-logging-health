'use strict'

var moment = require('moment')

var mockRequest = sinon.stub()
var mockMoment = {
  utc: sinon.stub(),
  duration: sinon.stub(),
  ISO_8601: sinon.stub()
}

var fetchLogs = mockrequire('../lib/fetchLogs', {
  'request': mockRequest,
  'moment': mockMoment
})

describe('fetchLogs', function() {

  var mockTimestamp = '2016-05-06T03:35:30+00:00'
  var now = moment.utc()
  var latency = moment.duration(now.diff(mockTimestamp))

  beforeEach(function() {
    mockMoment.utc.returns(now)
    mockMoment.ISO_8601.returns(false)
    mockMoment.duration.returns(latency)
  })

  describe('when logs exist', function() {
    it('enriches the input object with information about recent kibana logs', function () {

      var mockLogId = 'AVSEIwl27uQ1F-AdIWZL'
      var mockResponse = {
        toJSON: sinon.stub().returns({
          body: {
            hits: {
              hits: [{
                _id: mockLogId,
                _source: {
                  '@timestamp': mockTimestamp
                }
              }]
            }
          }
        })
      }
      mockRequest.callsArgWith(1, null, mockResponse)

      var input = {
        id: 'i-31f1acb5',
        name: 'staging-a-buildkite-31f1acb5'
      }

      var expectedOutput = {
        'id': input.id,
        'lastEntry': {
          'createdAt': now.format(),
          'id': mockLogId,
          'latencyHuman': latency.humanize(),
          'latencySeconds': latency.asSeconds()
        },
        'name': input.name,
        'searchedAt': now.format()
      }

      return fetchLogs(input)
        .then(function (output) {
          expect(output).to.eql(expectedOutput)
        })
    })
  })

  describe('when logs do not exist', function () {
    it('enriches the input object accordingly', function () {
      var input = {
        id: 'i-000',
        name: 'staging-x-never-000'
      }

      var mockNoLogsResponse = {
        toJSON: sinon.stub().returns({
          body: {
            hits: {
              hits: []
            }
          }
        })
      }
      mockRequest.callsArgWith(1, null, mockNoLogsResponse)

      var expectedOutput = {
        'id': input.id,
        'lastEntry': null,
        'name': input.name,
        'searchedAt': now.format()
      }

      return fetchLogs(input)
        .then(function(output) {
          expect(output).to.eql(expectedOutput)
        })
    })
  })
})
