'use strict'

// import Slack from 'slack-node'
// import Promise from './promise'

export default (message) => {
  console.log('SLACK! '+message)
  // return new Promise((resolve, reject) => {
  //   var slack = new Slack()
  //   slack.setWebhook(process.env.SLACK_WEBHOOK_URL)
  //   slack.webhook({
  //     channel: '#logging-health',
  //     username: 'Logging Health',
  //     icon_emoji: ':robot_face:',
  //     text: message
  //   }, (err, response) => {
  //     err ? reject(err) : resolve(response)
  //   })
  // })
}
