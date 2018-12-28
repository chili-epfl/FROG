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
  Meteor.publish('teacher.graph', function(graphId) {
    const graph = Graphs.findOne(graphId);
    if (!graph || !graph.ownerId === this.userID) {
      return this.ready();
    }
    return [
      Activities.find({ graphId }),
      Operators.find({ graphId }),
      Connections.find({ graphId })
    ];
  });

  Meteor.publish('session.students', slug =>
    Meteor.users.find(
      { joinedSessions: slug },
      { fields: { username: 1, joinedSessions: 1, role: 1 } }
    )
  );

  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('externalOperators', ExternalOperators);
  teacherPublish('dashboardData', DashboardData);
  teacherPublish('connections', Connections);
  teacherPublish('uploadList', UploadList);
  teacherPublishOwn('graphs', Graphs);
  teacherPublishOwn('sessions', Sessions);
}

Meteor.methods({
  'make.teacher': userid =>
    Meteor.users.update(userid, { $set: { role: 'teacher' } }),
  'get.object.product': id => [Objects.findOne(id), Products.findOne(id)]
});
