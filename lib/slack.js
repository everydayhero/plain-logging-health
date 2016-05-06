'use strict'

var Slack = require('slack-node')
var Promise = require('./promise')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    var slack = new Slack()
    slack.setWebhook(process.env.SLACK_WEBHOOK_URL)
    slack.webhook({
      channel: '#logging-health',
      username: 'Logging Health',
      icon_emoji: ':robot_face:',
      text: message
    }, function (err, response) {
      err ? reject(err) : resolve(response)
    })
  })
}
