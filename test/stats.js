'use strict'

import stats from '../lib/stats'

describe('Stats adaptor', () => {
  it('names metrics correctly', () => {
    stats.increment('test_increment')
    stats.decrement('test_decrement.with bad% char@ct&rs')
    stats.gauge('test_gauge', 400)
    expect(stats._getQueue()).to.contain('plain_logging_health.test_increment:1|c\n')
    expect(stats._getQueue()).to.contain('plain_logging_health.test_decrement.with_bad__char_ct_rs:-1|c\n')
    expect(stats._getQueue()).to.contain('plain_logging_health.test_gauge:400|g\n')
  })

  it('tracks timers', (done) => {
    stats.timerStart('test_timer')
    setTimeout(() => {
      stats.timerStop('test_timer')
      expect(stats._getQueue()).to.contain('plain_logging_health.test_timer:')
      done()
    }, 5)
  })
})

