'use strict'

const mockRequest = {
  post: sinon.stub().returns(mockRequest),
  type: sinon.stub().returns(mockRequest),
  send: sinon.stub().returns(mockRequest),
  end: sinon.stub().returns(mockRequest),
  abort: sinon.stub().returns(mockRequest)
}

const statsd = mockrequire('../lib/_statsd', {
  'superagent': mockRequest
})

describe('Statsd', () => {
  before(statsd.disconnect)
  beforeEach(statsd.flush)

  it('queues and names metrics correctly', () => {
    const expectedOutput = 'test_increment:1|c\ntest_decrement.with_bad__char_ct_rs:-1|c\ntest_gauge:400|g\ntest_count:2|c@1\n'
    statsd.increment('test_increment')
    statsd.decrement('test_decrement.with bad% char@ct&rs')
    statsd.gauge('test_gauge', 400)
    statsd.count('test_count', 2, 1)
    expect(statsd._getQueue()).to.eql(expectedOutput)
  })

  it('tracks timers', (done) => {
    statsd.timerStart('test_timer')
    setTimeout(() => {
      statsd.timerStop('test_timer')
      expect(statsd._getQueue()).to.contain('test_timer:')
      done()
    }, 5)
  })

  it('prefixes metrics with an app-level namespace', () => {
    statsd.connect({ namespace: 'test_app' }).count('test_count', 1)
    expect(statsd._getQueue()).to.eql('test_app.test_count:1|c\n')
  })
})
