'use strict'

import _ from 'lodash'
import Promise from './promise'
import AWS from 'aws-sdk'
const ec2 = new AWS.EC2({
  region: 'us-east-1'
})

const formatHosts = (reservations) => {
  return _.reduce(reservations, (output, value) => {
    output.push({
      id: value.Instances[0].InstanceId,
      name: _.filter(value.Instances[0].Tags, { 'Key': 'Name' })[0].Value
    })

    return output
  }, [])
}

export default () => {
  return new Promise((resolve, reject) => {
    ec2.describeInstances({
      'Filters': [{
        'Name': 'instance.group-name',
        'Values': ['bastion-access']
      }]
    })
    .on('success', (response) => {
      var collection = formatHosts(response.data.Reservations)
      resolve(collection)
    })
    .on('error', (error) => {
      console.log(error)
      reject(error)
    })
    .send()
  })
}
