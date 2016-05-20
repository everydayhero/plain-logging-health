'use strict'

const mockInstances = [
  {InstanceId: 'mockid', Tags: [{Key: 'Name', Value: 'mockName'}]},
  {InstanceId: 'mockid2', Tags: [{Key: 'Name', Value: 'mockName2'}]}
]
const mockDescribeResult = {
  data: {
    Reservations: [
      {Instances: [mockInstances[0]]},
      {Instances: [mockInstances[1]]}
    ]
  }
}
const mockDescribeOn = sinon.stub()
const mockDescribe = sinon.stub().returns({
  on: mockDescribeOn.returns(mockDescribe)
})

const mockAWS = {
  EC2: function () {
    return {
      describeInstances: mockDescribe
    }
  }
}

const fetchHosts = mockrequire('../lib/fetchHosts', {
  'aws-sdk': mockAWS
})

const expectedEc2Hosts = [
  { id: mockInstances[0].InstanceId, name: mockInstances[0].Tags[0].Value },
  { id: mockInstances[1].InstanceId, name: mockInstances[1].Tags[0].Value }
]

describe('fetchHosts', () => {
  it('returns an array of EC2 hosts with the bastion-access group', () => {
    mockDescribeOn.withArgs('success').yields(mockDescribeResult)

    return fetchHosts()
      .then((result) => {
        expect(_.sortBy(result, 'id')).to.eql(expectedEc2Hosts)
      })
  })
})
