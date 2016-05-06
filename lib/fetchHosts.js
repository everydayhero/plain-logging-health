'use strict'

var _ = require('lodash')
var Promise = require('./promise')
var AWS = require('aws-sdk')
var ec2 = new AWS.EC2({
  region: 'us-east-1'
})

function formatHosts (reservations) {
  return _.reduce(reservations, function (output, value) {
    output.push({
      id: value.Instances[0].InstanceId,
      name: _.filter(value.Instances[0].Tags, { 'Key': 'Name' })[0].Value
    })

    return output
  }, [])
}

module.exports = function fetchHosts () {
  return new Promise(function (resolve, reject) {
    ec2.describeInstances({
      'Filters': [{
        'Name': 'instance.group-name',
        'Values': ['bastion-access']
      }]
    })
      .on('success', function (response) {
        var collection = formatHosts(response.data.Reservations)
        resolve(collection)
      })
      .on('error', function (error) {
        console.log(error)
        reject(error)
      })
      .send()
  })
}
