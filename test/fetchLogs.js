'use strict'

import moment from 'moment'

const mockRequest = sinon.stub()
const mockMoment = {
  utc: sinon.stub(),
  duration: sinon.stub(),
  ISO_8601: sinon.stub()
}

const fetchLogs = mockrequire('../lib/fetchLogs', {
  'request': mockRequest,
  'moment': mockMoment
})

describe('fetchLogs', () => {
  const mockTimestamp = '2016-05-06T03:35:30+00:00'
  const now = moment.utc()
  const latency = moment.duration(now.diff(mockTimestamp))

  beforeEach(() => {
    mockMoment.utc.returns(now)
    mockMoment.ISO_8601.returns(false)
    mockMoment.duration.returns(latency)
  })

  describe('when logs exist', () => {
    it('enriches the input object with information about recent kibana logs', () => {
      const mockLogId = 'AVSEIwl27uQ1F-AdIWZL'
      const mockResponse = {
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

      const input = {
        id: 'i-31f1acb5',
        name: 'staging-a-buildkite-31f1acb5'
      }

      const expectedOutput = {
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
        .then((output) => {
          expect(output).to.eql(expectedOutput)
        })
    })
  })

  describe('when logs do not exist', () => {
    it('enriches the input object accordingly', () => {
      const input = {
        id: 'i-000',
        name: 'staging-x-never-000'
      }

      const mockNoLogsResponse = {
        toJSON: sinon.stub().returns({
          body: {
            hits: {
              hits: []
            }
          }
        })
      }
      mockRequest.callsArgWith(1, null, mockNoLogsResponse)

      const expectedOutput = {
        'id': input.id,
        'lastEntry': null,
        'name': input.name,
        'searchedAt': now.format()
      }

      return fetchLogs(input)
        .then((output) => {
          expect(output).to.eql(expectedOutput)
        })
    })
  })
})
