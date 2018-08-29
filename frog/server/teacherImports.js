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

const teacherPublish = (publish, collection, limitation) => {
  Meteor.publish(publish, function() {
    const role = Meteor.users.findOne(this.userId)?.role;
    if (role === 'teacher' || role === 'admin') {
      return limitation ? collection.find({}, limitation) : collection.find({});
    } else {
      return this.ready();
    }
  });
};

const teacherPublishOwn = (publish, collection) => {
  Meteor.publish(publish, function() {
    const role = Meteor.users.findOne(this.userId)?.role;
    if (role === 'teacher' || role === 'admin') {
      return collection.find({ ownerId: this.userId });
    } else {
      return this.ready();
    }
  });
};

export default function() {
  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('externalOperators', ExternalOperators);
  teacherPublish('dashboardData', DashboardData);
  teacherPublish('connections', Connections);
  teacherPublish('uploadList', UploadList);
  teacherPublishOwn('graphs', Graphs, this.userId);
  teacherPublish('objects', Objects);
  teacherPublish('products', Products);
  teacherPublishOwn('sessions', Sessions, this.userId);
  teacherPublish('users', Meteor.users, {
    fields: { username: 1, joinedSessions: 1, role: 1 }
  });
}

Meteor.methods({
  'make.teacher': userid =>
    Meteor.users.update(userid, { $set: { role: 'teacher' } })
});
