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

const teacherPublish = (publish, collection) =>
  Meteor.publish(publish, function() {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return collection.find({});
    } else {
      return this.ready();
    }
  });

const presence = () => {
  Meteor.publish('userPresence', function() {
    return Presences.find({}, { fields: { state: true, userId: true } });
  });
};

export default () => {
  presence();
  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('connections', Connections);
  teacherPublish('activity_data', ActivityData);
  teacherPublish('graphs', Graphs);
  teacherPublish('objects', Objects);
  teacherPublish('products', Products);
  teacherPublish('sessions', Sessions);
};
