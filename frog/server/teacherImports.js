/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Connections,
  DashboardData
} from '../imports/api/activities.js';
import { UploadList } from '../imports/api/openUploads.js';
import { Operators, ExternalOperators } from '../imports/api/operators.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';

const teacherPublish = (publish, collection, limitation) =>
  Meteor.publish(publish, function() {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return limitation ? collection.find({}, limitation) : collection.find({});
    } else {
      return this.ready();
    }
  });

export default () => {
  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('externalOperators', ExternalOperators);
  teacherPublish('dashboardData', DashboardData);
  teacherPublish('users', Meteor.users, {
    fields: { username: 1, joinedSessions: 1 }
  });
  teacherPublish('connections', Connections);
  teacherPublish('uploadList', UploadList);
  teacherPublish('graphs', Graphs);
  teacherPublish('objects', Objects);
  teacherPublish('products', Products);
  teacherPublish('sessions', Sessions);
};
