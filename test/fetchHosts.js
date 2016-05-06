'use strict'

var mockInstances = [
  {InstanceId: 'mockid', Tags: [{Key: 'Name', Value: 'mockName'}]},
  {InstanceId: 'mockid2', Tags: [{Key: 'Name', Value: 'mockName2'}]}
]
var mockDescribeResult = {
  data: {
    Reservations: [
      {Instances: [mockInstances[0]]},
      {Instances: [mockInstances[1]]}
    ]
  }
}
var mockDescribeOn = sinon.stub()
var mockDescribe = sinon.stub().returns({
  on: mockDescribeOn.returns(mockDescribe)
})

var mockAWS = {
  EC2: function () {
    return {
      describeInstances: mockDescribe
    }
  }
}

var fetchHosts = mockrequire('../lib/fetchHosts', {
  'aws-sdk': mockAWS
})

var expectedEc2Hosts = [
  { id: mockInstances[0].InstanceId, name: mockInstances[0].Tags[0].Value },
  { id: mockInstances[1].InstanceId, name: mockInstances[1].Tags[0].Value }
]

describe('fetchHosts', function() {
  it('returns an array of EC2 hosts with the bastion-access group', function() {
    mockDescribeOn.withArgs('success').yields(mockDescribeResult)

    return fetchHosts()
      .then(function(result) {
        expect(_.sortBy(result, 'id')).to.eql(expectedEc2Hosts);
      })
  });
});
