import { Meteor } from 'meteor/meteor'

Meteor.publish('userData', () => Meteor.users.find({}))

import '../imports/api/messages.js'

import '../imports/api/activities.js'
import '../imports/api/graphs.js'

import '../imports/api/sessions.js'

import '../imports/api/logs.js'

import '../imports/api/activityData.js'
import '../imports/api/products.js'
