const envSchema = require('env-schema')
const PushNotifications = require('node-pushnotifications')

const schema = {
  type: 'object',
  required: ['APN_TOKEN_KEY', 'APN_TOKEN_KEY_ID', 'APN_TOKEN_TEAM_ID', 'BUNDLE_ID', 'DEVICE_ID'],
  properties: {
    APN_TOKEN_KEY: {
      type: 'string'
    },
    APN_TOKEN_KEY_ID: {
      type: 'string'
    },
    APN_TOKEN_TEAM_ID: {
      type: 'string'
    },
    BUNDLE_ID: {
      type: 'string'
    },
    DEVICE_ID: {
      type: 'string'
    },
    NODE_ENV: {
      type: 'string',
      enum: ['dev', 'test', 'production']
    }
  }
}

async function run () {
  const config = envSchema({
    schema,
    dotenv: true
  })

  const pushNotifications = new PushNotifications({
    apn: {
      token: {
        key: config.APN_TOKEN_KEY,
        keyId: config.APN_TOKEN_KEY_ID,
        teamId: config.APN_TOKEN_TEAM_ID
      },
      production: config.NODE_ENV === 'production'
    }
  })

  const data = { title: 'Proposal Approval', topic: config.BUNDLE_ID, body: 'New proposal approval.[Account: agcTest4]', priority: 'normal', silent: false, timeToLive: 600, retries: 5, custom: { eventId: '0fdb0c5f6019052fece36f796d1d431452e7f041136008415fa3407e75abc266', kind: 9291 } }
  const deviceIds = [{ id: config.DEVICE_ID, type: 'apn' }]
  console.log(`Sending notification: ${JSON.stringify(data)} to devices: ${JSON.stringify(deviceIds)}`)
  const result = await pushNotifications.send(deviceIds, data)
  console.log('Result from sending notification: ', JSON.stringify(result, null, 4))
}

run()
