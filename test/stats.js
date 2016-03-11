'use strict'

var stats = require('../lib/stats');

describe('Stats adaptor', function() {

  it('names metrics correctly', function() {
    stats.increment('test_increment');
    stats.decrement('test_decrement.with bad% char@ct&rs');
    stats.gauge('test_gauge', 400);
    expect(stats._getQueue()).to.contain('test.plain_logging_health.test_increment:1|c\n');
    expect(stats._getQueue()).to.contain('test.plain_logging_health.test_decrement.with_bad__char_ct_rs:-1|c\n');
    expect(stats._getQueue()).to.contain('test.plain_logging_health.test_gauge:400|g\n');
  });

  it('tracks timers', function(done) {
    stats.timerStart('test_timer')
    setTimeout(function() {
      stats.timerStop('test_timer');
      expect(stats._getQueue()).to.contain('test.plain_logging_health.test_timer:');
      done();
    }, 5);
  });

});
