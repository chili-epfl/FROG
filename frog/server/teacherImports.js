/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Connections,
  DashboardData,
  UploadList,
  Operators,
  ExternalOperators,
  Graphs,
  Sessions,
  Products,
  Objects
} from '/imports/collections';

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
  teacherPublishOwn('graphs', Graphs, this.userId);
  teacherPublishOwn('sessions', Sessions, this.userId);
}

Meteor.methods({
  'make.teacher': userid =>
    Meteor.users.update(userid, { $set: { role: 'teacher' } }),
  'get.object.product': id => [Objects.findOne(id), Products.findOne(id)]
});
