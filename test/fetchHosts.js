'use strict'

var fetchHosts = require('../lib/fetchHosts');

var expectedEc2Hosts = [
  { id: 'i-0fba13b9', name: 'staging-a-clock-0fba13b9' },
  { id: 'i-1a579a93', name: 'sandbox-a-rabbitmq-1a579a93' },
  { id: 'i-2a7364ab', name: 'staging-d-buildkite-2a7364ab' },
  { id: 'i-3316f7ba', name: 'staging-mesos-master-2' },
  { id: 'i-3f11578c', name: 'staging-b-buildkite-3f11578c' },
  { id: 'i-4719f8ce', name: 'staging-mesos-master-0' },
  { id: 'i-823bee0b', name: 'staging-a-build-823bee0b' },
  { id: 'i-c3b8e373', name: 'staging-b-app-c3b8e373' },
  { id: 'i-c6f7a870', name: 'staging-a-router-c6f7a870' },
  { id: 'i-c75d8d4e', name: 'staging-a-admin-c75d8d4e' },
  { id: 'i-cae30e7c', name: 'staging-a-worker-cae30e7c' },
  { id: 'i-cc0e8f19', name: 'staging-a-admin-cc0e8f19' },
  { id: 'i-d342eb65', name: 'staging-a-app-d342eb65' },
  { id: 'i-de15d857', name: 'staging-a-rabbitmq-de15d857' },
  { id: 'i-fa2ebe49', name: 'staging-b-build-fa2ebe49' },
]

describe('fetchHosts', function() {
  it('returns an array of EC2 hosts with the bastion-access group', function() {
    this.timeout(5000);

    return fetchHosts()
      .then(function(result) {
        expect(_.sortBy(result, 'id')).to.eql(expectedEc2Hosts);
      })
  });
});
