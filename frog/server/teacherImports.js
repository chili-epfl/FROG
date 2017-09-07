/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Operators,
  Connections
} from '../imports/api/activities.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { ActivityData } from '../imports/api/activityData.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';
import { Uploads } from '../imports/api/uploads.js';
import { OpenUploads } from '../imports/api/openUploads.js';

export default () => {
  Meteor.publish('activities', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Activities.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('operators', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Operators.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('connections', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Connections.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('activity_data', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return ActivityData.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('graphs', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Graphs.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('objects', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Objects.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('products', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Products.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('sessions', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Sessions.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('uploads', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return Uploads.find({});
    } else {
      return this.ready();
    }
  });
  Meteor.publish('openUploads', function() {
    if (Meteor.users.findOne(this.userId).username === 'teacher') {
      return OpenUploads.find({});
    } else {
      return this.ready();
    }
  });
};
