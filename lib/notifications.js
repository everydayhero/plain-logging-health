var AWS = require('aws-sdk')
var Promise = require('./promise');
var sns = new AWS.SNS();
var stats = require('./stats');

exports.publish = function(subject, message) {
  return new Promise(function(resolve, reject) {
    var params = {
      TopicArn: process.env.MESSAGE_AVAILABLE_SNS_TOPIC_ARN,
      Message: message,
      Subject: subject
    };

    sns.publish(params, function(err, data) {
      if (err) {
        stats.increment('sns.publish.error');
        reject(err);
      } else {
        stats.increment('sns.publish.success');
        resolve(data);
      }
    });
  })
};
