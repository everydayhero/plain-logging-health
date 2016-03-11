var snsPublishStub = sinon.stub();
var mockAWS = {
  SNS: function() {
    return {
      publish: snsPublishStub
    }
  }
};
var notifications = mockrequire('../lib/notifications', {
  'aws-sdk': mockAWS
});

describe('Notifications', function() {

  describe('#publish', function() {

    it('returns a promise', function() {
      var returned = notifications.publish('Test subject', 'Test message');
      expect(returned).to.be.instanceOf(Promise);
    })

    it('allows a subject and message to be published via SNS', function() {
      notifications.publish('Test subject', 'Test message');
      expect(snsPublishStub.getCall(0).args[0]).to.be.eql({
        TopicArn: process.env.MESSAGE_AVAILABLE_SNS_TOPIC_ARN,
        Message: 'Test message',
        Subject: 'Test subject'
      });
    })

    it('returns the exact response when SNS publish is successful', function() {
      notifications.publish('a', 'b')
        .then(function(response) {
          expect(response).to.be.eql({ 'test': 'success' })
        });

      snsPublishStub.callArgWith(1, null, { 'test': 'success' })
    })

    it('returns the exact response when SNS publish errored', function() {
      notifications.publish('a', 'b')
        .catch(function(response) {
          expect(response).to.be.eql({ 'test': 'failed' });
        });

      snsPublishStub.callArgWith(1, { 'test': 'failed' }, null);
    })

  })

})
